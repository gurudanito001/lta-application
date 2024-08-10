import { Router } from 'express';
import {
  getCallsController,
  getCallsBetweenTwoUsersController,
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
router.get('/twoUsers/:user1/:user2', authValidation, getCallsBetweenTwoUsersController);
router.get('/summary/:userId', authValidation, getCallStatsController);
router.get('/:id', authValidation, getCallByIdController);
router.post('/', saveCallController);
router.post('/update', updateCallController);
router.post('/setDuration', setCallTimeController);
router.patch('/clearHistory', authValidation, clearCallLogsController);

export default router;