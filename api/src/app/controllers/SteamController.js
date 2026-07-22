import Game from '../schemas/Game';
import SteamService from '../../services/SteamService';

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
            const imported = await Game.find({
                steamAppId: { $in: library.games.map(game => game.appId) },
            }).select('steamAppId');
            const importedIds = new Set(imported.map(game => game.steamAppId));

            return res.json({
                steamId: library.steamId,
                games: library.games.map(game => ({
                    ...game,
                    imported: importedIds.has(game.appId),
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
            const existing = await Game.find({
                steamAppId: { $in: selected.map(game => game.appId) },
            }).select('steamAppId');
            const existingIds = new Set(existing.map(game => game.steamAppId));
            const toImport = selected.filter(game => !existingIds.has(game.appId));
            const created = [];

            for (const steamGame of toImport) {
                const lastPlayedYear = steamGame.lastPlayedAt
                    ? steamGame.lastPlayedAt.getFullYear()
                    : null;
                const steamCoverUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.appId}/library_600x900.jpg`;
                const game = await Game.create({
                    name: steamGame.name,
                    status: requested.get(steamGame.appId),
                    platform: 'Steam',
                    year: lastPlayedYear || undefined,
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
            }

            return res.status(201).json({
                imported: created,
                skipped: selected.length - created.length,
            });
        } catch (error) {
            return steamError(res, error);
        }
    }
}

export default new SteamController();
