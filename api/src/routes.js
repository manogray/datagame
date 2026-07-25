import express, { Router } from 'express';
import multer from 'multer';

import { ImageUploadConfig } from './config/multer';

import GameController from './app/controllers/GameController';
import RawgController from './app/controllers/RawgController';
import SteamController from './app/controllers/SteamController';
import StatsController from './app/controllers/StatsController';
import GamePlanController from './app/controllers/GamePlanController';
import BackupController from './app/controllers/BackupController';

const routes = new Router();

const uploadImage = multer(ImageUploadConfig);
const uploadBackup = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 },
});

routes.use(express.static('data'));

routes.get('/', (req, res) => {
    return res.json({ version: '1.0' });
});

routes.get('/stats', StatsController.index);
routes.get('/backup/export', BackupController.export);
routes.post('/backup/import', uploadBackup.single('backup'), BackupController.import);
routes.get('/game-plan', GamePlanController.show);
routes.get('/game-plan/eligible', GamePlanController.eligible);
routes.put('/game-plan', GamePlanController.replace);
routes.patch('/game-plan/items/:gameId/complete', GamePlanController.complete);

routes.get('/games', GameController.index);
routes.get('/games/search', RawgController.index);
routes.get('/games/:id', GameController.show);
routes.get('/steam/library', SteamController.library);
routes.get('/steam/search', SteamController.search);
routes.post('/steam/import', SteamController.importGames);
routes.post('/steam/sync', SteamController.sync);
routes.post('/games', uploadImage.single('photo'), GameController.store);
routes.put('/games/:id', uploadImage.single('photo'), GameController.update);
routes.delete('/games/:id', GameController.delete);

export default routes;
