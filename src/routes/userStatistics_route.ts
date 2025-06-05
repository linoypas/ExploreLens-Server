import express from "express";
import { authMiddleware } from "../controllers/auth_controller";
import userStatisticsController from "../controllers/userStatistics_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserStatistics
 *   description: API for calculating user travel statistics
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserStatistics:
 *       type: object
 *       required:
 *         - userId
 *         - percentageVisited
 *         - countryCount
 *         - continents
 *         - countries
 *         - siteCount
 *       properties:
 *         _id:
 *           type: string
 *           description: The record ID
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         percentageVisited:
 *           type: string
 *           description: Percentage of all known sites visited (e.g. "2.3%")
 *         countryCount:
 *           type: integer
 *           description: How many distinct countries visited
 *         continents:
 *           type: array
 *           items:
 *             type: string
 *           description: List of continents visited
 *         countries:
 *           type: array
 *           items:
 *             type: string
 *           description: List of country names visited
 *         siteCount:
 *           type: integer
 *           description: Total number of sites visited
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When these stats were generated
 *       example:
 *         userId: "60d0fe4f5311236168a109cb"
 *         percentageVisited: "1.5%"
 *         countryCount: 3
 *         continents: ["Europe","Asia"]
 *         countries: ["France", "Japan", "United States"]
 *         siteCount: 42
 *         createdAt: "2025-05-23T12:34:56.789Z"
 */

/**
 * @swagger
 * /user_statistics/{userId}:
 *   get:
 *     summary: Calculate and return user travel statistics
 *     tags: [UserStatistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to generate stats for
 *     responses:
 *       200:
 *         description: The user’s travel statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatistics'
 *       400:
 *         description: Invalid user ID or missing parameters
 *       500:
 *         description: Server error
 */
router.get(
  "/:userId",
  authMiddleware,
  userStatisticsController.calculate.bind(userStatisticsController)
);

export default router;
