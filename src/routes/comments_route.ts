/**
 * @file comment_route.ts
 * @description Defines the comment routes for the ExploreLens server.
 */

import express from "express";
import commentController from "../controllers/comments_controller";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: comments
 *   description: The comment API
 */


/**
 * @swagger
 * /comments/{siteId}:
 *   get:
 *     summary: Get all comment of post by postId
 *     tags: [comments]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: The site ID of the site to retrieve comments.
 *     responses:
 *       200:
 *         description: Returns all the comments of the site
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/comments'
 *       500:
 *         description: Server error
 */
router.get("/:siteId", commentController.getBySiteId.bind(commentController));

/**
 * @swagger
 * /comments/{siteId}/{commentId}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [comments]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the site
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *     responses:
 *       200:
 *         description: comment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/comments'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: comment not found
 *       500:
 *         description: Server error
 */
router.get("/:siteId/:commentId", commentController.getById.bind(commentController));

/**
 * @swagger
 * /comments/{siteId}:
 *   post:
 *     summary: Create a new comment
 *     tags: [comments]
 *     parameters:
 *        - in: path
 *          name: siteId
 *          required: true
 *          schema:
 *            type: string
 *          description: MongoDB ObjectId of the site
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
 *         description: comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/comments'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/:siteId",authMiddleware, commentController.create.bind(commentController));

/**
 * @swagger
 * /comments/{siteId}/{commentId}:
 *   put:
 *     summary: Update a comment's rating
 *     tags: [comments]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the site
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/comments'
 *     responses:
 *       200:
 *         description: comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/comments'
 *       404:
 *         description: comment not found
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.put("/:siteId/:commentId", authMiddleware, commentController.update.bind(commentController));

/**
 * @swagger
 * /comments/{siteId}/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [comments]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the site
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *     responses:
 *       200:
 *         description: comment deleted
 *       404:
 *         description: comment not found
 *       500:
 *         description: Server error
 */
router.delete("/:siteId/:commentId", authMiddleware, commentController.delete.bind(commentController));

/**
 * @swagger
 * components:
  *   schemas:
 *     comments:
 *       type: object
 *       properties:
 *         owner:
 *           type: string
 *           description: owner who left the comment
 *         content:
 *           type: string
 *           description: Comment content
 *         date:
 *           type: string
 *           format: date
 *           readOnly: true
 *           description: Date of the comment (set by server)
*/

export default router;