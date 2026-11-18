import { Router } from 'express';

import {
  teacherOnly,
  studentOnly
} from '../middleware/auth.middleware.js';

import * as dashboard from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/admin', teacherOnly, dashboard.admin);

router.get('/student', studentOnly, dashboard.student);

export default router;