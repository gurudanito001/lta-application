import { Router } from 'express';
import {
  getAppVersionsController,
  getAppVersionByIdController,
  createAppVersionController,
  updateAppVersionController,
  deleteAppVersionController
} from '../controllers/appVersion.controllers';
import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', authValidation, getAppVersionsController);
router.get('/:id', authValidation, getAppVersionByIdController);
router.post('/', authValidation, createAppVersionController);;
router.patch('/:id', authValidation, updateAppVersionController);
router.delete('/:id', authValidation, deleteAppVersionController);

export default router;