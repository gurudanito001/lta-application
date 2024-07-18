import { Router } from 'express';
import homeRouter from './home.routes';
import usersRouter from './users.routes';
import authRouter from './auth.routes';
import recommendationRoutes from './recommendations.routes';
import callsRoutes from './calls.routes';
import blockingRoutes from './blocking.routes';
import ratingRoutes from './ratings.routes';
import reportRoutes from './reports.routes';

// Create a new Router instance
const router = Router();

// Mount the routers
router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/recommendations', recommendationRoutes);
router.use('/calls', callsRoutes);
router.use('/blockings', blockingRoutes);
router.use('/ratings', ratingRoutes);
router.use('/reports', reportRoutes);

export default router;