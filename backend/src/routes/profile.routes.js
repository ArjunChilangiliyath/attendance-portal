
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as profile from '../controllers/profile.controller.js';
import { profileUpdate } from '../validators/schema.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Authenticated user profile management
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieves the profile of the currently authenticated user.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, profile.get);

/**
 * @swagger
 * /api/profile:
 *   patch:
 *     summary: Update current user's profile
 *     description: Updates the first name, last name, or phone number of the authenticated user.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Arjun
 *               lastName:
 *                 type: string
 *                 example: Kumar
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.patch(
  '/',
  authenticate,
  validate(profileUpdate),
  profile.update
);

export default router;
