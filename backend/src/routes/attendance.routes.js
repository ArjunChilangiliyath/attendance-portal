import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as attendance from '../controllers/attendance.controller.js';

import {
  attendanceBulk,
  attendanceUpdate
} from '../validators/schema.js';

const router = Router();

router.post(
  '/',
  teacherOnly,
  validate(attendanceBulk),
  attendance.bulk
);

router.get('/', attendance.list);

router.patch(
  '/:id',
  teacherOnly,
  validate(attendanceUpdate),
  attendance.update
);

router.get('/student/:id', attendance.studentHistory);

router.get('/class/:id', attendance.classHistory);

export default router;