import { Router } from 'express';
import {
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
  updateListeningPreferencesController,
  getMoodsController,
  setTopicsController,
  setFeelingController,
  setAvailabilityController,
  checkUsernameAvailability,
  setProfileImageController,
  getLanguagesController,
  createListeningPreferencesController,
  getListenersController,
  followUserController,
  unFollowUserController,
  getFollowersController,
  getFollowingController,
  changePasswordController,
  checkIfIFollowUserController,
  checkIfUserFollowsMeController
} from '../controllers/users.controllers';
import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/moods/all', getMoodsController);
router.get('/languages/all', getLanguagesController);
router.post('/username/availability', checkUsernameAvailability);
router.get('/', authValidation, getUsersController);
router.get('/listeners', authValidation, getListenersController);
router.get('/:id', authValidation, getUserByIdController);
router.patch('/profile', authValidation, updateUserController);
router.post('/listeningPreferences', authValidation, createListeningPreferencesController);
router.patch('/listeningPreferences', authValidation, updateListeningPreferencesController);
router.delete('/:id', authValidation, deleteUserController);
router.patch('/topics', authValidation, setTopicsController);
router.patch('/feeling', authValidation, setFeelingController);
router.patch('/availability', authValidation, setAvailabilityController);
router.patch('/profileImage', authValidation, setProfileImageController);
router.patch('/changePassword', authValidation, changePasswordController);

router.post('/follow', authValidation, followUserController);
router.post('/unFollow', authValidation, unFollowUserController);
router.get('/follow/getFollowers', authValidation, getFollowersController);
router.get('/follow/getFollowing', authValidation, getFollowingController);
router.post('/follow/checkFollowing', authValidation, checkIfIFollowUserController);
//router.post('/follow/checkIfFollowed', authValidation, checkIfUserFollowsMeController);


export default router;