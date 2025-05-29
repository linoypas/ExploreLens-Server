import express from "express";
import { authMiddleware } from "../controllers/auth_controller";
import siteInfoHistoryController from "../controllers/siteInfoHistory_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SiteInfoHistory
 *   description: API for site information history
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SiteInfoHistory:
 *       type: object
 *       required:
 *         - siteInfoId
 *         - userId
 *         - geoHash
 *         - longitude                       
 *         - latitude
 *       properties:
 *         _id:
 *           type: string
 *         siteInfoId:
 *           type: string
 *         userId:
 *           type: string
 *         geoHash:
 *           type: string
 *         longitude:
 *           type: string
 *         latitude:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         siteInfoId: "6123456789abcdef01234567"
 *         userId: "6123456789abcdef01234568"
 *         geoHash: "sv8wrh7z"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 */

router.get("/", siteInfoHistoryController.getAll.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history/daterange:
 *   get:
 *     summary: Get records by date range
 *     tags: [SiteInfoHistory]
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *     responses:
 *       200:
 *         description: Records retrieved
 */
router.get("/daterange", siteInfoHistoryController.getByDateRange.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history/filter:
 *   get:
 *     summary: Get records by user and site ID within a date range
 *     tags: [SiteInfoHistory]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: siteInfoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Filtered records
 */
router.get("/filter", siteInfoHistoryController.getByUserAndSiteRange.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history/user/{userId}:
 *   get:
 *     summary: Get records by user ID
 *     tags: [SiteInfoHistory]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Records retrieved
 */
router.get("/user/:userId", siteInfoHistoryController.getByUserId.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history/site/{siteInfoId}:
 *   get:
 *     summary: Get records by site ID
 *     tags: [SiteInfoHistory]
 *     parameters:
 *       - in: path
 *         name: siteInfoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Records retrieved
 */
router.get("/site/:siteInfoId", siteInfoHistoryController.getBySiteId.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history/{id}:
 *   get:
 *     summary: Get a record by ID
 *     tags: [SiteInfoHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Found record
 *       404:
 *         description: Record not found
 */
router.get("/:id", siteInfoHistoryController.getById.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history:
 *   post:
 *     summary: Create or update a site-visit record
 *     description: |
 *       If a record with the same `siteInfoId` and `userId` already exists, its `geohash`, `longitude`, `latitude`, and `createdAt`
 *       will be updated (returns **200**). Otherwise a new record is created (returns **201**).
 *     tags: [SiteInfoHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - siteInfoId
 *               - userId
 *               - geohash
 *               - longitude
 *               - latitude
 *             properties:
 *               siteInfoId:
 *                 type: string
 *               userId:
 *                 type: string
 *               geohash:
 *                 type: string
 *               longitude:
 *                 type: string
 *               latitude:
 *                 type: string
 *             example:
 *               siteInfoId: "6123456789abcdef01234567"
 *               userId:     "6831a9e5e86745c5a3d16df4"
 *               geohash:    "sv8wrh7z"
 *               longitude:  "12.4924"
 *               latitude:   "41.8902"
 *     responses:
 *       200:
 *         description: Existing record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SiteInfoHistory'
 *       201:
 *         description: New record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SiteInfoHistory'
 *       400:
 *         description: Validation error (missing or malformed fields)
 *       409:
 *         description: Duplicate key conflict
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, siteInfoHistoryController.create.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history/{id}:
 *   put:
 *     summary: Update a record by ID
 *     tags: [SiteInfoHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SiteInfoHistory'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put("/:id", authMiddleware, siteInfoHistoryController.update.bind(siteInfoHistoryController));

/**
 * @swagger
 * /siteinfo_history/{id}:
 *   delete:
 *     summary: Delete a record by ID
 *     tags: [SiteInfoHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete("/:id", authMiddleware, siteInfoHistoryController.delete.bind(siteInfoHistoryController));

export default router;
