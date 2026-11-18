
import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as students from '../controllers/student.controller.js';

import {
  studentCreate,
  studentUpdate
} from '../validators/schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management operations
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieves a paginated list of students.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 */
router.get('/', teacherOnly, students.list);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
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
 *         description: Student retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Student not found
 */
router.get('/:id', teacherOnly, students.get);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a student
 *     description: Creates a student and requests a password setup email from Auth0.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - classId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *                 maxLength: 100
 *               lastName:
 *                 type: string
 *                 maxLength: 100
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 30
 *               classId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
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
  validate(studentCreate),
  students.create
);

/**
 * @swagger
 * /api/students/{id}:
 *   patch:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 100
 *               lastName:
 *                 type: string
 *                 maxLength: 100
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 30
 *               classId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Student not found
 */
router.patch(
  '/:id',
  teacherOnly,
  validate(studentUpdate),
  students.update
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Deactivate a student
 *     description: Deactivates a student rather than permanently deleting the record.
 *     tags: [Students]
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
 *         description: Student deactivated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Student not found
 */
router.delete('/:id', teacherOnly, students.remove);

export default router;
