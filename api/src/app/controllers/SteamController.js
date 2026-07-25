import Game from '../schemas/Game';
import SteamService from '../../services/SteamService';
import { normalizeGameName } from '../../utils/gameName';

function steamError(res, error) {
    const status = error.statusCode || 502;
    const messages = {
        400: 'Informe um SteamID ou link de perfil válido',
        403: 'A biblioteca não está pública nas configurações de privacidade da Steam',
        404: 'Perfil da Steam não encontrado',
        503: 'A integração com a Steam não está configurada',
    };

    return res.status(status).json({
        error: messages[status] || 'Não foi possível consultar a Steam',
    });
}

class SteamController {
    async search(req, res) {
        const query = String(req.query.query || '').trim();

        if (query.length < 2) {
            return res.status(400).json({ error: 'Informe pelo menos 2 caracteres para buscar' });
        }

        try {
            const games = await SteamService.searchApps(query);
            return res.json(games);
        } catch (error) {
            return steamError(res, error);
        }
    }

    async library(req, res) {
        try {
            const library = await SteamService.getLibrary(req.query.profile);
            const imported = await Game.find().select('name normalizedName steamAppId');
            const importedIds = new Set(imported.map(game => game.steamAppId));
            const importedNames = new Set(imported.map(game => (
                game.normalizedName || normalizeGameName(game.name)
            )));

            return res.json({
                steamId: library.steamId,
                games: library.games.map(game => ({
                    ...game,
                    imported: importedIds.has(game.appId)
                        || importedNames.has(normalizeGameName(game.name)),
                })),
            });
        } catch (error) {
            return steamError(res, error);
        }
    }

    async importGames(req, res) {
        const { steamId, games: requestedGames } = req.body;

        if (!/^\d{17}$/.test(String(steamId || ''))) {
            return res.status(400).json({ error: 'SteamID inválido' });
        }

        if (!Array.isArray(requestedGames) || !requestedGames.length || requestedGames.length > 20) {
            return res.status(400).json({ error: 'Selecione entre 1 e 20 jogos por importação' });
        }

        const requested = new Map(requestedGames.map(game => [
            Number(game.appId),
            game.status === 'finished' ? 'finished' : 'progress',
        ]));

        try {
            const library = await SteamService.getOwnedGames(steamId);
            const selected = library.filter(game => requested.has(game.appId));
            const existing = await Game.find().select('name normalizedName steamAppId');
            const existingIds = new Set(existing.map(game => game.steamAppId));
            const existingNames = new Set(existing.map(game => (
                game.normalizedName || normalizeGameName(game.name)
            )));
            const toImport = selected.filter(game => (
                !existingIds.has(game.appId)
                && !existingNames.has(normalizeGameName(game.name))
            ));
            const created = [];

            for (const steamGame of toImport) {
                const steamCoverUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.appId}/library_600x900.jpg`;
                const status = requested.get(steamGame.appId);
                const game = await Game.create({
                    name: steamGame.name,
                    normalizedName: normalizeGameName(steamGame.name),
                    status,
                    platform: status === 'finished' ? 'Steam' : null,
                    year: null,
                    coverUrl: steamCoverUrl,
                    fallbackCoverUrl: steamGame.iconUrl,
                    coverSource: 'steam',
                    externalId: null,
                    sourceUrl: steamGame.steamUrl,
                    steamAppId: steamGame.appId,
                    steamPlaytimeMinutes: steamGame.playtimeMinutes,
                    steamLastPlayedAt: steamGame.lastPlayedAt,
                });

                created.push(game);
                existingNames.add(normalizeGameName(steamGame.name));
            }

            const skipped = selected.length - created.length;
            return res.status(201).json({
                imported: created,
                skipped,
                message: skipped
                    ? `${skipped} jogo(s) já estava(m) cadastrado(s) e não foi(ram) importado(s).`
                    : null,
            });
        } catch (error) {
            if (error && error.code === 11000) {
                return res.status(409).json({ error: 'Este jogo já está cadastrado' });
            }
            return steamError(res, error);
        }
    }

    async sync(req, res) {
        const profile = String(req.body.profile || '').trim();

        if (!profile) {
            return res.status(400).json({ error: 'Informe o perfil Steam usado na sincronização' });
        }

        try {
            const library = await SteamService.getLibrary(profile);
            const libraryByAppId = new Map(library.games.map(game => [game.appId, game]));
            const registeredGames = await Game.find({
                steamAppId: { $in: library.games.map(game => game.appId) },
            }).select('_id steamAppId');

            if (registeredGames.length) {
                await Game.bulkWrite(registeredGames.map(game => {
                    const steamGame = libraryByAppId.get(game.steamAppId);
                    return {
                        updateOne: {
                            filter: { _id: game._id },
                            update: {
                                $set: {
                                    steamPlaytimeMinutes: steamGame.playtimeMinutes,
                                    steamLastPlayedAt: steamGame.lastPlayedAt,
                                },
                            },
                        },
                    };
                }));
            }

            const totalWithSteamId = await Game.countDocuments({ steamAppId: { $ne: null } });

            return res.json({
                steamId: library.steamId,
                updated: registeredGames.length,
                notFound: Math.max(totalWithSteamId - registeredGames.length, 0),
                syncedAt: new Date(),
            });
        } catch (error) {
            return steamError(res, error);
        }
    }
}

export default new SteamController();
