import { Router } from 'express';
import {
  getCallsController,
  getCallStatsController,
  getCallByIdController,
  saveCallController,
  updateCallController,
  setCallTimeController,
  clearCallLogsController,
} from '../controllers/call.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Calls routes
router.get('/', authValidation, getCallsController);
router.get('/summary/:userId', authValidation, getCallStatsController);
router.get('/:id', authValidation, getCallByIdController);
router.post('/', saveCallController);
router.post('/update', updateCallController);
router.post('/setDuration', setCallTimeController);
router.patch('/clearHistory', authValidation, clearCallLogsController);

export default router;