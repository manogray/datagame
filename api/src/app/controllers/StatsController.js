import Game from '../schemas/Game';

class StatsController {
    async index(req, res) {
        try {
            const [total, finished, progress, platformDistribution, topYears] = await Promise.all([
                Game.countDocuments(),
                Game.countDocuments({ status: 'finished' }),
                Game.countDocuments({ status: 'progress' }),
                Game.aggregate([
                    { $match: { status: 'finished', platform: { $type: 'string', $ne: '' } } },
                    { $group: { _id: '$platform', count: { $sum: 1 } } },
                    { $sort: { count: -1, _id: 1 } },
                ]),
                Game.aggregate([
                    { $match: { status: 'finished', year: { $type: 'number' } } },
                    { $group: { _id: '$year', count: { $sum: 1 } } },
                    { $sort: { count: -1, _id: -1 } },
                    { $limit: 1 },
                ]),
            ]);

            const topPlatform = platformDistribution[0] || null;
            const topYear = topYears[0] || null;

            return res.json({
                total,
                finished,
                progress,
                topPlatform: topPlatform
                    ? { name: topPlatform._id, count: topPlatform.count }
                    : null,
                topYear: topYear
                    ? { year: topYear._id, count: topYear.count }
                    : null,
                platformDistribution: platformDistribution.map(item => ({
                    name: item._id,
                    count: item.count,
                })),
                updatedAt: new Date(),
            });
        } catch (error) {
            return res.status(500).json({ error: 'Não foi possível carregar as estatísticas' });
        }
    }
}

export default new StatsController();
