/**
 * @file siteInfo_route.ts
 * @description Defines the siteInfo routes for the ExploreLens server.
 */

import express from "express";
import siteInfoController from "../controllers/siteInfo_controller";
const router = express.Router();
import { upload } from '../middlewares/uploader';
import { siteInformationController, mockSiteInformation } from '../controllers/siteDetection_controller';
import { authMiddleware } from "../controllers/auth_controller";


/**
 * @swagger
 * tags:
 *   name: siteInfo
 *   description: The siteInfo API
 */

/**
 * @swagger
 * /site-info/mock-data:
 *   post:
 *     summary: Send mock data of famous sites in an uploaded image
 *     description: Send mock data of famous sites in an uploaded image.
 *     tags:
 *       - Site Detection
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Mock data returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success, failure, assume]
 *                 description:
 *                   type: string
 *                 siteInformation:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     x:
 *                       type: number
 *                     y:
 *                       type: number
 *                     siteName:
 *                       type: string
 *       400:
 *         description: No file uploaded
 */
router.post('/mock-data', upload.single('image'), mockSiteInformation);

/**
 * @swagger
 * /site-info/detect-site:
 *   post:
 *     summary: Detect famous sites in an uploaded image
 *     description: Uploads an image, detects landmarks and returns site information.
 *     tags:
 *       - Site Detection
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Detection result returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success, failure, assume]
 *                 description:
 *                   type: string
 *                 siteInformation:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     x:
 *                       type: number
 *                     y:
 *                       type: number
 *                     siteName:
 *                       type: string
 *       400:
 *         description: No file uploaded
 */
router.post('/detect-site', upload.single('image'), siteInformationController);


/**
 * @swagger
 * /site-info:
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
 * /site-info/{siteId}:
 *   get:
 *     summary: Get a siteInfo by siteId
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the siteInfo
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
router.get("/:siteId", siteInfoController.getById.bind(siteInfoController));

/**
 * @swagger
 * /site-info/{siteId}/reduced:
 *   get:
 *     summary: Get a siteInfo by ID
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the siteInfo
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
router.get("/:siteId/reduced", siteInfoController.getReducedSiteInfo.bind(siteInfoController));

/**
 * @swagger
 * /site-info:
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
 * /site-info/rating/{siteId}:
 *   post:
 *     summary: Update a siteInfo's rating
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: siteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the siteInfo
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - userId
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating to be added
 *                 example: 4.5
 *               userId:
 *                 type: string
 *                 description: ID of the user submitting the rating
 *                 example: 64f16b9351263f04e6efb2a0
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
router.post("/rating/:siteId", siteInfoController.addRating.bind(siteInfoController));

/**
 * @swagger
 * /site-info/{siteId}:
 *   delete:
 *     summary: Delete a siteInfo by siteId
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: siteId
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
router.delete("/:siteId", siteInfoController.delete.bind(siteInfoController));

/**
 * @swagger
 * components:
 *   schemas:
 *     SiteInfo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID of the siteInfo
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
 *         rating:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: the id of the userId
 *               value:
 *                 type: number
 *                 description: the value of rating
 *         imageUrl: 
 *           type: string
 *           description: image url using UNSPLASH
 *         reviewsIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User who left the review
 *               content:
 *                 type: string
 *                 description: review content
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the review
 *           description: List of reviews for the site
 */

export default router;