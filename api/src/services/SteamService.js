import https from 'https';

class SteamService {
    constructor() {
        this.catalog = null;
        this.catalogExpiresAt = 0;
    }

    request(url) {
        return new Promise((resolve, reject) => {
            https.get(url, response => {
                let body = '';

                response.on('data', chunk => {
                    body += chunk;
                });

                response.on('end', () => {
                    let data;

                    try {
                        data = JSON.parse(body);
                    } catch (error) {
                        return reject(new Error('Invalid response from Steam'));
                    }

                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        const error = new Error('Steam request failed');
                        error.statusCode = response.statusCode;
                        return reject(error);
                    }

                    return resolve(data);
                });
            }).on('error', reject);
        });
    }

    getApiKey() {
        const apiKey = process.env.STEAM_API_KEY;

        if (!apiKey) {
            const error = new Error('STEAM_API_KEY is not configured');
            error.statusCode = 503;
            throw error;
        }

        return apiKey;
    }

    parseProfile(profile) {
        const value = String(profile || '').trim().replace(/\/$/, '');

        if (/^\d{17}$/.test(value)) {
            return { steamId: value };
        }

        const idMatch = value.match(/steamcommunity\.com\/profiles\/(\d{17})/i);
        if (idMatch) {
            return { steamId: idMatch[1] };
        }

        const vanityMatch = value.match(/steamcommunity\.com\/id\/([^/?#]+)/i);
        if (vanityMatch) {
            return { vanity: vanityMatch[1] };
        }

        if (/^[a-zA-Z0-9_-]{2,64}$/.test(value)) {
            return { vanity: value };
        }

        const error = new Error('Invalid Steam profile');
        error.statusCode = 400;
        throw error;
    }

    async resolveProfile(profile) {
        const parsed = this.parseProfile(profile);

        if (parsed.steamId) {
            return parsed.steamId;
        }

        const params = new URLSearchParams({
            key: this.getApiKey(),
            vanityurl: parsed.vanity,
        });
        const data = await this.request(
            `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?${params.toString()}`
        );

        if (!data.response || data.response.success !== 1) {
            const error = new Error('Steam profile not found');
            error.statusCode = 404;
            throw error;
        }

        return data.response.steamid;
    }

    async getOwnedGames(steamId) {
        const params = new URLSearchParams({
            key: this.getApiKey(),
            steamid: steamId,
            include_appinfo: 'true',
            include_played_free_games: 'true',
            format: 'json',
        });
        const data = await this.request(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?${params.toString()}`
        );
        const response = data.response || {};

        if (!Array.isArray(response.games)) {
            const error = new Error('Steam library is private');
            error.statusCode = 403;
            throw error;
        }

        return response.games
        .sort((first, second) => (second.rtime_last_played || 0) - (first.rtime_last_played || 0))
        .map(game => ({
            appId: game.appid,
            name: game.name,
            playtimeMinutes: game.playtime_forever || 0,
            recentPlaytimeMinutes: game.playtime_2weeks || 0,
            lastPlayedAt: game.rtime_last_played
                ? new Date(game.rtime_last_played * 1000)
                : null,
            iconUrl: game.img_icon_url
                ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                : null,
            steamUrl: `https://store.steampowered.com/app/${game.appid}`,
        }));
    }

    async getLibrary(profile) {
        const steamId = await this.resolveProfile(profile);
        const games = await this.getOwnedGames(steamId);

        return { steamId, games };
    }

    async getCatalog() {
        if (this.catalog && Date.now() < this.catalogExpiresAt) {
            return this.catalog;
        }

        const apps = [];
        let lastAppId = 0;
        let haveMoreResults = true;

        while (haveMoreResults) {
            const input = {
                include_games: true,
                include_dlc: false,
                include_software: false,
                include_videos: false,
                include_hardware: false,
                max_results: 50000,
            };

            if (lastAppId) {
                input.last_appid = lastAppId;
            }

            const params = new URLSearchParams({
                key: this.getApiKey(),
                input_json: JSON.stringify(input),
            });
            const data = await this.request(
                `https://api.steampowered.com/IStoreService/GetAppList/v1/?${params.toString()}`
            );
            const response = data.response || {};
            const page = response.apps || [];

            apps.push(...page);
            haveMoreResults = Boolean(response.have_more_results && page.length);
            lastAppId = response.last_appid || (page.length && page[page.length - 1].appid);
        }

        this.catalog = apps.filter(app => app.name);
        this.catalogExpiresAt = Date.now() + (6 * 60 * 60 * 1000);
        return this.catalog;
    }

    async searchApps(query) {
        const normalizedQuery = query.toLocaleLowerCase();
        const catalog = await this.getCatalog();

        return catalog
            .filter(app => app.name.toLocaleLowerCase().includes(normalizedQuery))
            .sort((first, second) => {
                const firstName = first.name.toLocaleLowerCase();
                const secondName = second.name.toLocaleLowerCase();
                const score = name => name === normalizedQuery ? 0 : name.startsWith(normalizedQuery) ? 1 : 2;
                return score(firstName) - score(secondName) || firstName.length - secondName.length;
            })
            .slice(0, 8)
            .map(app => ({
                id: app.appid,
                appId: app.appid,
                name: app.name,
                year: null,
                platforms: ['Steam'],
                coverUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${app.appid}/library_600x900.jpg`,
                sourceUrl: `https://store.steampowered.com/app/${app.appid}`,
                source: 'steam',
            }));
    }
}

export default new SteamService();
