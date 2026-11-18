import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as settings from '../controllers/settings.controller.js';

import { settingsUpdate } from '../validators/schema.js';

const router = Router();

router.get('/', settings.list);

router.patch(
  '/',
  teacherOnly,
  validate(settingsUpdate),
  settings.update
);

export default router;