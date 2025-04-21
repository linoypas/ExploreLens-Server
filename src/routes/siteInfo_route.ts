/**
 * @file siteInfo_route.ts
 * @description Defines the siteInfo routes for the ExploreLens server.
 */

import express from "express";
import siteInfoController from "../controllers/siteInfo_controller";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: siteInfo
 *   description: The siteInfo API
 */

/**
 * @swagger
 * /siteInfo/sitename/{sitename}:
 *   get:
 *     summary: Get a siteInfo by name or fetch and create it if not found
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: sitename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the site to retrieve or fetch info for
 *     responses:
 *       200:
 *         description: Returns the existing or newly created siteInfo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SiteInfo'
 *       500:
 *         description: Server error
 */
router.get("/sitename/:sitename", siteInfoController.getBySitename.bind(siteInfoController));

/**
 * @swagger
 * /siteInfo:
 *   get:
 *     summary: Get all siteInfo documents
 *     tags: [siteInfo]
 *     responses:
 *       200:
 *         description: List of all siteInfo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SiteInfo'
 *       500:
 *         description: Server error
 */
router.get("/", siteInfoController.getAll.bind(siteInfoController));

/**
 * @swagger
 * /siteInfo/{id}:
 *   get:
 *     summary: Get a siteInfo by ID
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the siteInfo
 *     responses:
 *       200:
 *         description: siteInfo object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SiteInfo'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: siteInfo not found
 *       500:
 *         description: Server error
 */
router.get("/:id", siteInfoController.getById.bind(siteInfoController));

/**
 * @swagger
 * /siteInfo:
 *   post:
 *     summary: Create a new siteInfo
 *     tags: [siteInfo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SiteInfo'
 *     responses:
 *       201:
 *         description: siteInfo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SiteInfo'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", siteInfoController.create.bind(siteInfoController));

/**
 * @swagger
 * /siteInfo/{id}:
 *   put:
 *     summary: Update a siteInfo's rating or comments
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the siteInfo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SiteInfo'
 *     responses:
 *       200:
 *         description: siteInfo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SiteInfo'
 *       404:
 *         description: siteInfo not found
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.put("/:id", siteInfoController.update.bind(siteInfoController));

/**
 * @swagger
 * /siteInfo/{id}:
 *   delete:
 *     summary: Delete a siteInfo by ID
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the siteInfo
 *     responses:
 *       200:
 *         description: siteInfo deleted
 *       404:
 *         description: siteInfo not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", siteInfoController.deleteItem.bind(siteInfoController));

/**
 * @swagger
 * components:
 *   schemas:
 *     SiteInfo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId of the siteInfo
 *         name:
 *           type: string
 *           description: The name of the site
 *         description:
 *           type: string
 *           description: A description of the site
 *         averageRating:
 *           type: number
 *           description: Average rating for the site
 *           example: 4.5
 *         ratingCount:
 *           type: number
 *           description: Number of ratings the site has received
 *           example: 10
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: User who left the comment
 *               content:
 *                 type: string
 *                 description: Comment content
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the comment
 *           description: List of comments for the site
 */

export default router;