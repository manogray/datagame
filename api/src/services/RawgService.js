import https from 'https';

class RawgService {
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
                        return reject(new Error('Invalid response from RAWG'));
                    }

                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        const error = new Error(data.detail || 'RAWG request failed');
                        error.statusCode = response.statusCode;
                        return reject(error);
                    }

                    return resolve(data);
                });
            }).on('error', reject);
        });
    }

    async search(query) {
        const apiKey = process.env.RAWG_API_KEY;

        if (!apiKey) {
            const error = new Error('RAWG_API_KEY is not configured');
            error.statusCode = 503;
            throw error;
        }

        const params = new URLSearchParams({
            key: apiKey,
            search: query,
            search_precise: 'true',
            page_size: '8',
        });

        const data = await this.request(`https://api.rawg.io/api/games?${params.toString()}`);

        return data.results.map(game => ({
            id: game.id,
            name: game.name,
            released: game.released,
            year: game.released ? Number(game.released.slice(0, 4)) : null,
            coverUrl: game.background_image,
            platforms: (game.platforms || []).map(item => item.platform.name),
            rawgUrl: `https://rawg.io/games/${game.slug}`,
        }));
    }
}

export default new RawgService();
