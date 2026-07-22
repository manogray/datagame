import RawgService from '../../services/RawgService';

class RawgController {
    async index(req, res) {
        const query = String(req.query.query || '').trim();

        if (query.length < 2) {
            return res.status(400).json({ error: 'Informe pelo menos 2 caracteres para buscar' });
        }

        try {
            const games = await RawgService.search(query);
            return res.json(games);
        } catch (error) {
            const status = error.statusCode === 401 || error.statusCode === 403
                ? 502
                : error.statusCode || 502;

            return res.status(status).json({
                error: status === 503
                    ? 'A busca de capas não está configurada'
                    : 'Não foi possível consultar a RAWG',
            });
        }
    }
}

export default new RawgController();
