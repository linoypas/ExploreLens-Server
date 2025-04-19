import express from 'express';
const router = express.Router();

import { upload } from '../middlewares/uploader';
import { siteInformationController, mockSiteInformation } from '../controllers/siteDetection_controller';

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

export default router;