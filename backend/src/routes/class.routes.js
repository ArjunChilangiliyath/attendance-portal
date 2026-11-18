
import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as classes from '../controllers/class.controller.js';

import {
  classCreate,
  classUpdate
} from '../validators/schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management operations
 */

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', classes.list);

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 120
 *               code:
 *                 type: string
 *                 maxLength: 30
 *               description:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 2000
 *               academicYear:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 20
 *     responses:
 *       201:
 *         description: Class created
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
  validate(classCreate),
  classes.create
);

/**
 * @swagger
 * /api/classes/{id}:
 *   patch:
 *     summary: Update a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 120
 *               code:
 *                 type: string
 *                 maxLength: 30
 *               description:
 *                 type: string
 *                 nullable: true
 *               academicYear:
 *                 type: string
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Class updated
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
 *         description: Class not found
 */
router.patch(
  '/:id',
  teacherOnly,
  validate(classUpdate),
  classes.update
);

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Deactivate a class
 *     description: Deactivates a class without permanently deleting it.
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Teacher access required
 *       404:
 *         description: Class not found
 */
router.delete('/:id', teacherOnly, classes.remove);

/**
 * @swagger
 * /api/classes/{id}/students:
 *   get:
 *     summary: Get students in a class
 *     tags: [Classes]
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
 *         description: Class students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Class not found
 */
router.get('/:id/students', classes.students);

export default router;
