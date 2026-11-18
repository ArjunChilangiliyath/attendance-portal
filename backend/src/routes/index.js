import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware.js';

import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import classRoutes from './class.routes.js';
import attendanceRoutes from './attendance.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import reportRoutes from './report.routes.js';
import profileRoutes from './profile.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

// Authenticate all API requests
router.use(authenticate);

// Mount individual route modules
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/profile', profileRoutes);
router.use('/settings', settingsRoutes);

export default router;