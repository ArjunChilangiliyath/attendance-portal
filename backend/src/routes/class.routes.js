import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as classes from '../controllers/class.controller.js';

import {
  classCreate,
  classUpdate
} from '../validators/schema.js';

const router = Router();

router.get('/', classes.list);

router.post(
  '/',
  teacherOnly,
  validate(classCreate),
  classes.create
);

router.patch(
  '/:id',
  teacherOnly,
  validate(classUpdate),
  classes.update
);

router.delete('/:id', teacherOnly, classes.remove);

router.get('/:id/students', classes.students);

export default router;