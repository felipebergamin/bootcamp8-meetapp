import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import TokenController from './app/controllers/TokenController';

import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import MeetupManagerController from './app/controllers/MeetupManagerController';

const upload = multer(multerConfig);
const router = new Router();

router.post('/users', UserController.store);
router.post('/auth', TokenController.store);

router.use(authMiddleware);
router.put('/users', UserController.update);
router.post('/files', upload.single('file'), FileController.store);

router.get('/mymeetups', MeetupManagerController.index);

router
  .route('/meetups')
  .post(MeetupController.store)
  .get(MeetupController.index);

router
  .route('/meetups/:meetupId')
  .put(MeetupController.update)
  .delete(MeetupController.delete);

router.post('/meetups/:meetupId/subscribe', SubscriptionController.store);

export default router;
