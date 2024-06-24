import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
  getMoodsController,
  setTopicsController,
  setFeelingController,
  setAvailabilityController,
  checkUsernameAvailability,
  setProfileImageController
} from '../controllers/users.controllers';
import {
  validateUser
} from '../utils/validators/users.validators';
import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', getUsersController);
router.get('/:id', getUserByIdController);
router.get('/moods/all', getMoodsController);;
router.patch('/topics', authValidation, setTopicsController);
router.patch('/feeling', authValidation, setFeelingController);
router.patch('/availability', authValidation, setAvailabilityController);
router.patch('/profileImage', authValidation, setProfileImageController);
router.post('/username/availability', checkUsernameAvailability);
/* router.post(
  '/', 
  validateUser,
  createUserController
);
router.put(
  '/:id',
  validateUser,
  updateUserController
); */
router.delete('/:id', deleteUserController);

export default router;