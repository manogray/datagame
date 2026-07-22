import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const ImageUploadConfig = {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'data', 'img'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err);

                return cb(null, res.toString('hex') + extname(file.originalname));
            });
        },
    }),
    fileFilter: (req, file, cb) => {
        return cb(null, file.mimetype.startsWith('image/'));
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};

export { ImageUploadConfig };
