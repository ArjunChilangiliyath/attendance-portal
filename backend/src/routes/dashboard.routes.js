
import { Router } from 'express';

import {
  teacherOnly,
  studentOnly
} from '../middleware/auth.middleware.js';

import * as dashboard from '../controllers/dashboard.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and summaries
 */

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieves student count, class count, and attendance statistics.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *             example:
 *               success: true
 *               message: Success
 *               data:
 *                 students: 40
 *                 classes: 4
 *                 attendance:
 *                   total: 200
 *                   present: 160
 *                   absent: 20
 *                   late: 15
 *                   excused: 5
 *               meta: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 */
router.get('/admin', teacherOnly, dashboard.admin);

/**
 * @swagger
 * /api/dashboard/student:
 *   get:
 *     summary: Get student dashboard
 *     description: Retrieves the authenticated student's attendance statistics and recent attendance records.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student dashboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *             example:
 *               success: true
 *               message: Success
 *               data:
 *                 attendance:
 *                   PRESENT: 15
 *                   ABSENT: 2
 *                   LATE: 1
 *                   EXCUSED: 0
 *                   total: 18
 *                   percentage: 88.89
 *                 recent: []
 *               meta: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Student access required
 */
router.get('/student', studentOnly, dashboard.student);

export default router;
