
import { Router } from 'express';

import { teacherOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

import * as settings from '../controllers/settings.controller.js';

import { settingsUpdate } from '../validators/schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: System settings management
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get all system settings
 *     description: Retrieves the current system settings.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', settings.list);

/**
 * @swagger
 * /api/settings:
 *   patch:
 *     summary: Update system settings
 *     description: Updates one or more system settings. Only teachers can perform this operation.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - settings
 *             properties:
 *               settings:
 *                 type: object
 *                 description: Settings key-value pairs to create or update.
 *                 additionalProperties: true
 *                 example:
 *                   attendance_start_time: "09:00"
 *                   attendance_end_time: "17:00"
 *     responses:
 *       200:
 *         description: Settings updated successfully
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
router.patch(
  '/',
  teacherOnly,
  validate(settingsUpdate),
  settings.update
);

export default router;
