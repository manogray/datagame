import Game from '../schemas/Game';
import GamePlan from '../schemas/GamePlan';

const BACKUP_FORMAT = 'datagame-mongo-dump';
const BACKUP_VERSION = 1;

async function validateDocuments(Model, documents) {
    for (const document of documents) {
        const model = new Model(document);
        await model.validate();
    }
}

class BackupController {
    async export(req, res) {
        try {
            const [games, gamePlans] = await Promise.all([
                Game.find().lean(),
                GamePlan.find().lean(),
            ]);

            const backup = {
                format: BACKUP_FORMAT,
                version: BACKUP_VERSION,
                exportedAt: new Date().toISOString(),
                database: 'datagame',
                collections: {
                    games,
                    gameplans: gamePlans,
                },
            };
            const date = new Date().toISOString().slice(0, 10);

            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="datagame-backup-${date}.datagame"`);
            return res.send(JSON.stringify(backup, null, 2));
        } catch (error) {
            return res.status(500).json({ error: 'Não foi possível exportar os dados do DataGame' });
        }
    }

    async import(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: 'Selecione um arquivo de backup do DataGame' });
        }

        let backup;

        try {
            backup = JSON.parse(req.file.buffer.toString('utf8'));
        } catch (error) {
            return res.status(400).json({ error: 'O arquivo selecionado não é um backup válido' });
        }

        const collections = backup && backup.collections;
        if (
            backup.format !== BACKUP_FORMAT
            || backup.version !== BACKUP_VERSION
            || !collections
            || !Array.isArray(collections.games)
            || !Array.isArray(collections.gameplans)
        ) {
            return res.status(400).json({ error: 'O arquivo selecionado não é um backup válido do DataGame' });
        }

        try {
            await validateDocuments(Game, collections.games);
            await validateDocuments(GamePlan, collections.gameplans);
        } catch (error) {
            return res.status(400).json({ error: 'O backup contém dados inválidos e não foi importado' });
        }

        const [currentGames, currentGamePlans] = await Promise.all([
            Game.find().lean(),
            GamePlan.find().lean(),
        ]);

        try {
            await GamePlan.deleteMany({});
            await Game.deleteMany({});

            if (collections.games.length) await Game.insertMany(collections.games);
            if (collections.gameplans.length) await GamePlan.insertMany(collections.gameplans);

            return res.json({
                message: 'Backup importado com sucesso',
                games: collections.games.length,
                gamePlans: collections.gameplans.length,
            });
        } catch (error) {
            try {
                await GamePlan.deleteMany({});
                await Game.deleteMany({});
                if (currentGames.length) await Game.insertMany(currentGames);
                if (currentGamePlans.length) await GamePlan.insertMany(currentGamePlans);
            } catch (rollbackError) {
                return res.status(500).json({
                    error: 'A importação falhou e os dados anteriores não puderam ser restaurados completamente',
                });
            }

            return res.status(400).json({ error: 'Não foi possível importar o backup; os dados anteriores foram mantidos' });
        }
    }
}

export default new BackupController();
