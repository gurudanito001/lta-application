import { Router } from 'express';
import {
  getCallsController,
  getCallByIdController,
  saveCallController,
  clearCallLogsController,
} from '../controllers/call.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', authValidation, getCallsController);
router.get('/:id', authValidation, getCallByIdController);
router.post('/', authValidation, saveCallController);;
router.patch('/clearHistory', authValidation, clearCallLogsController);

export default router;