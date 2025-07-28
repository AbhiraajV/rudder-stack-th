import express from 'express';
import {
  registerUser,
  requestOtp,
  verifyOtp,
  getUserById,
  getApiKeys,
} from '../controllers/user.controller';

const router = express.Router();

/**
 * @openapi
 * /public/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 */
router.post('/auth/register', registerUser);

/**
 * @openapi
 * /public/auth/request-otp:
 *   post:
 *     summary: Request an OTP for login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       404:
 *         description: User not found
 */
router.post('/auth/request-otp', requestOtp);

/**
 * @openapi
 * /public/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and generate API key
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *             required:
 *               - email
 *               - code
 *     responses:
 *       200:
 *         description: Returns API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *       401:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
router.post('/auth/verify-otp', verifyOtp);

/**
 * @openapi
 * /public/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: User not found
 */
router.get('/users/:id', getUserById);

/**
 * @openapi
 * /public/users/api-keys:
 *   get:
 *     summary: Get current API key (from header)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for authentication
 *     responses:
 *       200:
 *         description: API key info
 */
router.get('/users/api-keys', getApiKeys);

export default router;
