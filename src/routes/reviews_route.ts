/**
 * @file review_route.ts
 * @description Defines the review routes for the ExploreLens server.
 */

import express from "express";
import reviewController from "../controllers/reviews_controller";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: reviews
 *   description: The review API
 */


/**
 * @swagger
 * /reviews/{siteId}:
 *   get:
 *     summary: Get all review of post by postId
 *     tags: [reviews]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The site ID of the site to retrieve reviews.
 *     responses:
 *       200:
 *         description: Returns all the reviews of the site
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/reviews'
 *       500:
 *         description: Server error
 */
router.get("/:siteId", reviewController.getBySiteId.bind(reviewController));

/**
 * @swagger
 * /reviews/{siteId}/{reviewId}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [reviews]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the site
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: review object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/reviews'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: review not found
 *       500:
 *         description: Server error
 */
router.get("/:siteId/:reviewId", reviewController.getById.bind(reviewController));

/**
 * @swagger
 * /reviews/{siteId}:
 *   post:
 *     summary: Create a new review
 *     tags: [reviews]
 *     parameters:
 *        - in: path
 *          name: siteId
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the site
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - owner
 *               - content
 *     responses:
 *       201:
 *         description: review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/reviews'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/:siteId", reviewController.create.bind(reviewController));

/**
 * @swagger
 * /reviews/{siteId}/{reviewId}:
 *   put:
 *     summary: Update a review's rating
 *     tags: [reviews]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the site
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/reviews'
 *     responses:
 *       200:
 *         description: review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/reviews'
 *       404:
 *         description: review not found
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.put("/:siteId/:reviewId", reviewController.update.bind(reviewController));

/**
 * @swagger
 * /reviews/{siteId}/{reviewId}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [reviews]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the site
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: review deleted
 *       404:
 *         description: review not found
 *       500:
 *         description: Server error
 */
router.delete("/:siteId/:reviewId", reviewController.delete.bind(reviewController));

/**
 * @swagger
 * components:
  *   schemas:
 *     reviews:
 *       type: object
 *       properties:
 *         owner:
 *           type: string
 *           description: owner who left the review
 *         content:
 *           type: string
 *           description: review content
 *         date:
 *           type: string
 *           format: date
 *           readOnly: true
 *           description: Date of the review (set by server)
*/

export default router;