import Game from '../schemas/Game';

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

        if (!photo && !coverUrl) {
            return res.status(400).json({ error: 'Selecione uma capa ou envie uma imagem' });
        }

        if (!photo && !isTrustedCover(coverUrl, coverSource)) {
            return res.status(400).json({ error: 'A URL da capa selecionada é inválida' });
        }

        try {
            const game = await Game.create({
                name,
                status,
                platform,
                year,
                photo,
                coverUrl: photo ? null : coverUrl,
                coverSource: photo ? 'upload' : coverSource,
                externalId: photo ? null : externalId,
                sourceUrl: photo ? null : sourceUrl,
                steamAppId: photo || coverSource !== 'steam' ? undefined : steamAppId,
            });

            return res.status(201).json(game);
        } catch (error) {
            return res.status(400).json({ error: 'Não foi possível cadastrar o jogo' });
        }

    }

    async index(req, res){

        const games = await Game.find().sort('name');

        return res.json(games);
    }

}

export default new GameController();
