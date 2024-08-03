import { Router } from 'express';
import {
  getNotificationsController,
  getNotificationByIdController,
  createNotificationController,
  updateNotificationController,
  deleteNotificationController
} from '../controllers/notification.controllers';
import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', authValidation, getNotificationsController);
router.get('/:id', authValidation, getNotificationByIdController);
router.post('/', authValidation, createNotificationController);;
router.patch('/:id', authValidation, updateNotificationController);
router.delete('/:id', authValidation, deleteNotificationController);

export default router;