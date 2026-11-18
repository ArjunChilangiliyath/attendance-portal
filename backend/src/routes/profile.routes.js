import { Router } from 'express';

import { validate } from '../middleware/validate.middleware.js';

import * as profile from '../controllers/profile.controller.js';

import { profileUpdate } from '../validators/schema.js';

const router = Router();

router.get('/', profile.get);

router.patch(
  '/',
  validate(profileUpdate),
  profile.update
);

export default router;