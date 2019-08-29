import { Router } from 'express';

import UserController from './app/controllers/UserController';
import TokenController from './app/controllers/TokenController';

import authMiddleware from './app/middlewares/auth';

const router = new Router();

router.post('/users', UserController.store);
router.post('/auth', TokenController.store);

router.use(authMiddleware);
router.put('/users', UserController.update);

export default router;
