
import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';

import * as reports from '../controllers/report.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Student and class attendance reports
 */

/**
 * @swagger
 * /api/reports/student/{id}:
 *   get:
 *     summary: Get student attendance report
 *     description: Retrieves a student's attendance records and attendance summary.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student attendance report retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *             example:
 *               success: true
 *               message: Success
 *               data:
 *                 student: {}
 *                 summary:
 *                   total: 5
 *                   present: 3
 *                   absent: 1
 *                   late: 1
 *                   excused: 0
 *                   attendancePercentage: 60
 *                 attendance: []
 *               meta: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 */
router.get('/student/:id', teacherOnly, reports.student);

/**
 * @swagger
 * /api/reports/class/{id}:
 *   get:
 *     summary: Get class attendance report
 *     description: Retrieves attendance records and attendance summary for a class.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class attendance report retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *             example:
 *               success: true
 *               message: Success
 *               data:
 *                 class: {}
 *                 summary:
 *                   total: 50
 *                   present: 40
 *                   absent: 5
 *                   late: 3
 *                   excused: 2
 *                   attendancePercentage: 80
 *                 attendance: []
 *               meta: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 */
router.get('/class/:id', teacherOnly, reports.klass);

/**
 * @swagger
 * /api/reports/export:
 *   get:
 *     summary: Export attendance report as CSV
 *     description: Downloads attendance records as a CSV file. Supports optional filters.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Filter by class ID
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Attendance CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: '"Date","Class","Class code","Student","Email","Status"'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 */
router.get('/export', teacherOnly, reports.exportCsv);

export default router;
