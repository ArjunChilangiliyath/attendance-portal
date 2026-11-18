
import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as attendance from '../controllers/attendance.controller.js';

import {
  attendanceBulk,
  attendanceUpdate
} from '../validators/schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management and history
 */

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Mark attendance for multiple students
 *     description: Creates or updates attendance records for students in a class on a particular date.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - date
 *               - records
 *             properties:
 *               classId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2026-11-18'
 *               records:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                     - status
 *                   properties:
 *                     studentId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [PRESENT, ABSENT, LATE, EXCUSED]
 *                     remarks:
 *                       type: string
 *                       nullable: true
 *                       maxLength: 500
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 */
router.post(
  '/',
  teacherOnly,
  validate(attendanceBulk),
  attendance.bulk
);

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get attendance records
 *     description: Retrieves attendance records accessible to the authenticated user.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', attendance.list);

/**
 * @swagger
 * /api/attendance/{id}:
 *   patch:
 *     summary: Update an attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, LATE, EXCUSED]
 *               remarks:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Attendance record not found
 */
router.patch(
  '/:id',
  teacherOnly,
  validate(attendanceUpdate),
  attendance.update
);

/**
 * @swagger
 * /api/attendance/student/{id}:
 *   get:
 *     summary: Get student attendance history
 *     tags: [Attendance]
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
 *         description: Student attendance history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.get('/student/:id', attendance.studentHistory);

/**
 * @swagger
 * /api/attendance/class/{id}:
 *   get:
 *     summary: Get class attendance history
 *     tags: [Attendance]
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
 *         description: Class attendance history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Class not found
 */
router.get('/class/:id', attendance.classHistory);

export default router;
