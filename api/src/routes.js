import express, { Router } from 'express';
import multer from 'multer';

import { ImageUploadConfig } from './config/multer';

import GameController from './app/controllers/GameController';

const routes = new Router();

const uploadImage = multer(ImageUploadConfig);

routes.use(express.static('data'));

routes.get('/', (req, res) => {
    return res.json({ version: '1.0' });
});

routes.get('/games', GameController.index);
routes.post('/games', uploadImage.single('photo'), GameController.store);

export default routes;
