import { Router } from 'express';
import {
  getBlockedUsersController,
  blockUserController,
  unBlockUserController,
  checkForBlockingController,
} from '../controllers/blocking.controller';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', authValidation, getBlockedUsersController);
router.post('/block', authValidation, blockUserController);
router.post('/unblock', authValidation, unBlockUserController);;
router.post('/check', authValidation, checkForBlockingController);

export default router;