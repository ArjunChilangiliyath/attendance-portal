import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as students from '../controllers/student.controller.js';

import {
  studentCreate,
  studentUpdate
} from '../validators/schema.js';

const router = Router();

router.get('/', teacherOnly, students.list);

router.get('/:id', teacherOnly, students.get);

router.post(
  '/',
  teacherOnly,
  validate(studentCreate),
  students.create
);

router.patch(
  '/:id',
  teacherOnly,
  validate(studentUpdate),
  students.update
);

router.delete('/:id', teacherOnly, students.remove);

export default router;