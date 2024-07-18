import { Router } from 'express';
import {
  getReportsController,
  createReportController
} from '../controllers/report.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', authValidation, getReportsController);
router.post('/', authValidation, createReportController);

export default router;