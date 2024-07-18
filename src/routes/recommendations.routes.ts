import { Router } from 'express';
import {
  getRecommendationsController,
  getRecommendationByIdController,
  createRecommendationController,
  updateRecommendationController,
  deleteRecommendationController
} from '../controllers/recommendations.controllers';

// New Router instance
const router = Router();

// Users routes
router.get('/', getRecommendationsController);
router.get('/:id', getRecommendationByIdController);
router.post('/', createRecommendationController);;
router.patch('/:id', updateRecommendationController);
router.delete('/:id', deleteRecommendationController);

export default router;