import multer from 'multer';
import { resolve, extname } from 'path';
import { randomBytes } from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'storage', 'uploads'),
    filename: (req, file, cb) => {
      randomBytes(16, (err, rawData) => {
        if (err) return cb(err);

        return cb(null, rawData.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

// /home/felipe/Dev/go-stack/meetapp/src/config/multer.js
