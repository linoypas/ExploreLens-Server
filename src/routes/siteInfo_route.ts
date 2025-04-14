import express from 'express';
const router = express.Router();

import { upload } from '../middlewares/uploader';
import { siteInformationController, mockSiteInformation } from '../controllers/siteDetectionController';
import { getGptSiteDetails, getSiteGptMockDetails }  from '../controllers/gptSiteInfoController';

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
 * /site-info/site-details:
 *   get:
 *     summary: Get details of a site using GPT-4
 *     description: Fetch detailed information about a site by its name using GPT-4.
 *     tags:
 *      - Site Detection
 *     parameters:
 *       - in: query
 *         name: siteName
 *         description: Name of the site to fetch details for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved site details
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       400:
 *         description: Bad request - No site name provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No site mentioned"
 */
router.get('/site-details', getGptSiteDetails );

/**
 * @swagger
 * /site-info/site-mock-details:
*   get:
 *     summary: Get mock details of a site
 *     description: Fetch mock details about a site by its name (mock data).
 *     tags:
 *      - Site Detection
 *     parameters:
 *       - in: query
 *         name: siteName
 *         description: Name of the site to fetch mock details for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved mock site details
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "The Eiffel Tower, located in Paris, France, is one of the most iconic landmarks in the world..."
 *       400:
 *         description: Bad request - No site name provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No site mentioned"
 */
router.get('/site-mock-details', getSiteGptMockDetails );


export default router;
