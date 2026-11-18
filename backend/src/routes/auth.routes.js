import { Router } from 'express';

import * as auth from '../controllers/auth.controller.js';

const router = Router();

router.get('/me', auth.me);

export default router;