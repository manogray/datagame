import express, { Router } from 'express';
import multer from 'multer';

import { ImageUploadConfig } from './config/multer';

import GameController from './app/controllers/GameController';
import RawgController from './app/controllers/RawgController';
import SteamController from './app/controllers/SteamController';

const routes = new Router();

const uploadImage = multer(ImageUploadConfig);

routes.use(express.static('data'));

routes.get('/', (req, res) => {
    return res.json({ version: '1.0' });
});

routes.get('/games', GameController.index);
routes.get('/games/search', RawgController.index);
routes.get('/steam/library', SteamController.library);
routes.get('/steam/search', SteamController.search);
routes.post('/steam/import', SteamController.importGames);
routes.post('/games', uploadImage.single('photo'), GameController.store);

export default routes;
