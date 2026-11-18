import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';

import * as reports from '../controllers/report.controller.js';

const router = Router();

router.get('/student/:id', teacherOnly, reports.student);

router.get('/class/:id', teacherOnly, reports.klass);

router.get('/export', teacherOnly, reports.exportCsv);

export default router;