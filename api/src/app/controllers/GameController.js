import Game from '../schemas/Game';

class GameController {

    async store(req, res){

        const { name, status, platform } = req.body;

        const { filename: photo } = req.file;

        await Game.create({
            name,
            status,
            platform,
            photo,
        });

        return res.json({ message: 'Game registered' });

    }

    async index(req, res){

        const games = await Game.find().sort('name');

        return res.json(games);
    }

}

export default new GameController();