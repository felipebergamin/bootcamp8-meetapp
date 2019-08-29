import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import TokenController from './app/controllers/TokenController';

import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

const upload = multer(multerConfig);
const router = new Router();

router.post('/users', UserController.store);
router.post('/auth', TokenController.store);

router.use(authMiddleware);
router.put('/users', UserController.update);
router.post('/files', upload.single('file'), FileController.store);
router.post('/meetups', MeetupController.store);
router.get('/meetups', MeetupController.index);
router.put('/meetups/:meetupId', MeetupController.update);

export default router;
