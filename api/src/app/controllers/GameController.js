import Game from '../schemas/Game';
import GamePlan from '../schemas/GamePlan';
import { promises as fs } from 'fs';
import { basename, resolve } from 'path';
import { normalizeGameName } from '../../utils/gameName';

function isTrustedCover(url, source) {
    try {
        const parsedUrl = new URL(url);
        const isRawg = parsedUrl.hostname === 'rawg.io' || parsedUrl.hostname.endsWith('.rawg.io');
        const isSteam = parsedUrl.hostname === 'cdn.cloudflare.steamstatic.com';

        return parsedUrl.protocol === 'https:'
            && ((source === 'rawg' && isRawg) || (source === 'steam' && isSteam));
    } catch (error) {
        return false;
    }
}

async function removePhoto(photo) {
    if (!photo || basename(photo) !== photo) return;

    const imagePath = resolve(__dirname, '..', '..', '..', 'data', 'img', photo);

    try {
        await fs.unlink(imagePath);
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
}

class GameController {

    async store(req, res){

        const {
            name,
            status,
            platform,
            year,
            coverUrl,
            coverSource,
            externalId,
            sourceUrl,
            steamAppId,
        } = req.body;

        const photo = req.file ? req.file.filename : null;
        const normalizedName = normalizeGameName(name);

        if (!normalizedName) {
            if (photo) await removePhoto(photo);
            return res.status(400).json({ error: 'Informe o nome do jogo' });
        }

        const existingGame = await Game.findOne({
            $or: [
                { normalizedName },
                { name: String(name).trim() },
            ],
        }).collation({ locale: 'pt', strength: 2 });

        if (existingGame) {
            if (photo) await removePhoto(photo);
            return res.status(409).json({ error: 'Este jogo já está cadastrado' });
        }

        if (!photo && !coverUrl) {
            return res.status(400).json({ error: 'Selecione uma capa ou envie uma imagem' });
        }

        if (!photo && !isTrustedCover(coverUrl, coverSource)) {
            return res.status(400).json({ error: 'A URL da capa selecionada é inválida' });
        }

        try {
            const isFinished = status === 'finished';
            const game = await Game.create({
                name: String(name).trim(),
                normalizedName,
                status,
                platform: isFinished ? platform || null : null,
                year: isFinished && year !== '' ? year : null,
                photo,
                coverUrl: photo ? null : coverUrl,
                coverSource: photo ? 'upload' : coverSource,
                externalId: photo ? null : externalId,
                sourceUrl: photo ? null : sourceUrl,
                steamAppId: photo || coverSource !== 'steam' ? undefined : steamAppId,
            });

            return res.status(201).json(game);
        } catch (error) {
            if (photo) await removePhoto(photo);
            if (error && error.code === 11000) {
                return res.status(409).json({ error: 'Este jogo já está cadastrado' });
            }
            return res.status(400).json({ error: 'Não foi possível cadastrar o jogo' });
        }

    }

    async index(req, res){

        const games = await Game.find().sort('name');

        return res.json(games);
    }

    async show(req, res) {
        try {
            const game = await Game.findById(req.params.id);

            if (!game) {
                return res.status(404).json({ error: 'Jogo não encontrado' });
            }

            return res.json(game);
        } catch (error) {
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }
    }

    async update(req, res) {
        let game;

        try {
            game = await Game.findById(req.params.id);
        } catch (error) {
            if (req.file) await removePhoto(req.file.filename);
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }

        if (!game) {
            if (req.file) await removePhoto(req.file.filename);
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }

        const hasExternalCover = Boolean(req.body.coverUrl);
        const replacesCover = Boolean(req.file || hasExternalCover);

        if (!req.file && hasExternalCover && !isTrustedCover(req.body.coverUrl, req.body.coverSource)) {
            return res.status(400).json({ error: 'A URL da capa selecionada é inválida' });
        }

        const oldPhoto = game.photo;

        const isFinished = req.body.status === 'finished';
        game.name = req.body.name;
        game.status = req.body.status;
        game.platform = isFinished ? req.body.platform || null : null;
        game.year = isFinished && req.body.year !== '' ? req.body.year : null;

        if (req.file) {
            game.photo = req.file.filename;
            game.coverUrl = null;
            game.fallbackCoverUrl = null;
            game.coverSource = 'upload';
            game.externalId = null;
            game.sourceUrl = null;
        } else if (hasExternalCover) {
            game.photo = null;
            game.coverUrl = req.body.coverUrl;
            game.fallbackCoverUrl = null;
            game.coverSource = req.body.coverSource;
            game.externalId = req.body.coverSource === 'rawg' ? req.body.externalId : null;
            game.sourceUrl = req.body.sourceUrl;

            if (req.body.coverSource === 'steam') {
                game.steamAppId = req.body.steamAppId;
            }
        }

        try {
            await game.save();
        } catch (error) {
            if (req.file) await removePhoto(req.file.filename);
            return res.status(400).json({ error: 'Não foi possível atualizar o jogo' });
        }

        if (replacesCover && oldPhoto && oldPhoto !== game.photo) {
            try {
                await removePhoto(oldPhoto);
            } catch (error) {
                // A atualização já foi persistida; a limpeza pode ser tentada posteriormente.
            }
        }

        if (game.status !== 'progress') {
            try {
                await GamePlan.updateOne({ key: 'current' }, { $pull: { items: { game: game._id } } });
            } catch (error) {
                // O jogo já foi atualizado; o plano poderá ser corrigido na próxima alteração.
            }
        }

        return res.json(game);
    }

    async delete(req, res) {
        try {
            const game = await Game.findById(req.params.id);

            if (!game) {
                return res.status(404).json({ error: 'Jogo não encontrado' });
            }

            await game.remove();
            try {
                await GamePlan.updateOne({ key: 'current' }, { $pull: { items: { game: game._id } } });
            } catch (error) {
                // O jogo já foi excluído; referências ausentes não são exibidas no plano.
            }

            try {
                await removePhoto(game.photo);
            } catch (error) {
                // O registro já foi excluído; não falhe a resposta por causa da limpeza.
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }
    }

}

export default new GameController();
