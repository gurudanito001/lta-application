import { Router } from 'express';
import homeRouter from './home.routes';
import usersRouter from './users.routes';
import authRouter from './auth.routes';
import recommendationRoutes from './recommendations.routes'

// Create a new Router instance
const router = Router();

// Mount the routers
router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/recommendation', recommendationRoutes);

export default router;