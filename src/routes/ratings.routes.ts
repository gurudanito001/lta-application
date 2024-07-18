import { Router } from 'express';
import {
  getRatingsController,
  createRatingController,
  calculateMeanRatingController
} from '../controllers/rating.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', authValidation, getRatingsController);
router.post('/', authValidation, createRatingController);
router.get('/average', authValidation, calculateMeanRatingController);;

export default router;