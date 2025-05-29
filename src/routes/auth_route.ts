import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import authController from "../controllers/auth_controller";

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* /auth/register:
*   post:
*     summary: Registers a new user and returns tokens
*     tags: [Auth]
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
*               password:
*                 type: string
*               profilePicture:
*                 type: string
*             required:
*               - name
*               - email
*               - password
*     responses:
*       200:
*         description: User created and logged in
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 accessToken:
*                   type: string
*                 refreshToken:
*                   type: string
*                 _id:
*                   type: string
*/
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 _id:
 *                   type: string
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: User login using Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials or request
 *       500:
 *         description: Server error
 */
router.post("/google", authController.googleSignin);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh tokens
 *     description: Refresh access and refresh tokens using the provided refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *       400:
 *         description: Invalid refresh token
 *       500:
 *         description: Server error
 */
router.post("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate the refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful logout
 *       400:
 *         description: Invalid refresh token
 *       500:
 *         description: Server error
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /auth/forgot:
 *   post:
 *     summary: Generate password reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset token generated
 *       404:
 *         description: User not found
 */
router.post("/forgot", authController.forgotPassword);

/**
 * @swagger
 * /auth/reset:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset", authController.resetPassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change the logged-in user’s password
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Missing fields or current password incorrect
 *       401:
 *         description: Access denied (invalid/missing token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post(
  "/change-password",
  authMiddleware,
  authController.changePassword
);


export default router;
