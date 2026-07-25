import mongoose from 'mongoose';

import Game from '../schemas/Game';
import GamePlan from '../schemas/GamePlan';

async function populatedPlan() {
    return GamePlan.findOne({ key: 'current' }).populate('items.game');
}

class GamePlanController {
    async show(req, res) {
        try {
            const plan = await populatedPlan();
            return res.json(plan || { key: 'current', items: [] });
        } catch (error) {
            return res.status(500).json({ error: 'Não foi possível carregar o plano de jogo' });
        }
    }

    async eligible(req, res) {
        try {
            const games = await Game.find({ status: 'progress' }).sort('name');
            return res.json(games);
        } catch (error) {
            return res.status(500).json({ error: 'Não foi possível carregar os jogos disponíveis' });
        }
    }

    async replace(req, res) {
        const items = Array.isArray(req.body.items) ? req.body.items : [];

        if (!items.length) {
            return res.status(400).json({ error: 'Adicione pelo menos um jogo ao plano' });
        }

        if (items.length > 100) {
            return res.status(400).json({ error: 'O plano pode ter no máximo 100 jogos' });
        }

        const gameIds = items.map(item => String(item.gameId || ''));
        const uniqueIds = new Set(gameIds);

        if (uniqueIds.size !== gameIds.length || gameIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ error: 'A lista contém jogos inválidos ou repetidos' });
        }

        if (items.some(item => !String(item.platform || '').trim())) {
            return res.status(400).json({ error: 'Informe a plataforma de todos os jogos' });
        }

        try {
            const eligibleGames = await Game.find({
                _id: { $in: gameIds },
                status: 'progress',
            }).select('_id');

            if (eligibleGames.length !== gameIds.length) {
                return res.status(400).json({ error: 'Todos os jogos do plano precisam estar em progresso' });
            }

            await GamePlan.findOneAndUpdate(
                { key: 'current' },
                {
                    key: 'current',
                    items: items.map(item => ({
                        game: item.gameId,
                        platform: String(item.platform).trim(),
                    })),
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            return res.json(await populatedPlan());
        } catch (error) {
            return res.status(400).json({ error: 'Não foi possível salvar o plano de jogo' });
        }
    }

    async complete(req, res) {
        try {
            const plan = await GamePlan.findOne({ key: 'current' });
            const item = plan && plan.items.find(entry => String(entry.game) === req.params.gameId);

            if (!item) {
                return res.status(404).json({ error: 'Jogo não encontrado no plano atual' });
            }

            const game = await Game.findById(item.game);
            if (!game) {
                plan.items = plan.items.filter(entry => String(entry.game) !== req.params.gameId);
                await plan.save();
                return res.status(404).json({ error: 'O cadastro deste jogo não existe mais' });
            }

            game.status = 'finished';
            game.year = new Date().getFullYear();
            game.platform = item.platform;
            await game.save();

            plan.items = plan.items.filter(entry => String(entry.game) !== req.params.gameId);
            await plan.save();

            return res.json({ game, plan: await populatedPlan() });
        } catch (error) {
            return res.status(400).json({ error: 'Não foi possível concluir o jogo' });
        }
    }
}

export default new GamePlanController();
