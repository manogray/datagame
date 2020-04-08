import { Router } from 'express';
import multer from 'multer';

import { ImageUploadConfig } from './config/multer';

import GameController from './app/controllers/GameController';

const routes = new Router();

const uploadImage = multer(ImageUploadConfig);

routes.get('/', (req, res) => {
    return res.json({ message: 'dataGame' });
});

routes.get('/games', GameController.index);
routes.post('/games', uploadImage.single('photo'), GameController.store);

export default routes;
