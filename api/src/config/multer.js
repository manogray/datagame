import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const ImageUploadConfig = {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'data', 'img'),
        filename: (req, file, cb) => {
            const [ mimeType, ] = file.mimetype.split('/');

            if(mimeType == 'image'){
                crypto.randomBytes(16, (err, res) => {
                    if (err) return cb(err);

                    return cb(null, res.toString('hex') + extname(file.originalname));
                });
            }
        },
    }),
};

export { ImageUploadConfig };
