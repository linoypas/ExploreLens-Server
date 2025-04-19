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
 * /siteInfo/siteInfoname/{siteInfoname}:
 *   get:
 *     summary: Get a siteInfo by siteInfoname
 *     description: Retrieve a siteInfo by their siteInfoname
 *     tags:
 *       - siteInfo
 *     parameters:
 *       - in: path
 *         name: siteInfoname
 *         schema:
 *           type: string
 *         required: true
 *         description: The siteInfoname of the siteInfo
 *     responses:
 *       200:
 *         description: The siteInfo object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/siteInfo'
 *       404:
 *         description: siteInfo not found
 *       500:
 *         description: Server error
 */
router.get("/sitename/:sitename", siteInfoController.getBySitename.bind(siteInfoController));

/**
 * @swagger
 * components:
 *   schemas:
 *     siteInfo:
 *       type: object
 *       required:
 *         - site name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the siteInfo
 *         description:
 *           type: string
 *           description: The description of the site
 *         comments:
 *           type: string
 *           description: The comments on the site
 *         rate:
 *           type: string
 *           description: rate of the site 
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         siteInfoname: eiffel towert
 *         description: The Eiffel Tower is a world-famous iron lattice tower located in Paris, France. Built by engineer Gustave Eiffel for the 1889 World's Fair, it stands 330 meters (1,083 feet) tall and was the tallest structure in the world until 1930. Today, it's one of the most iconic landmarks in the world and a symbol of France, attracting millions of visitors every year.
 *         comments:
 */

/**
 * @swagger
 * /siteInfo:
 *   get:
 *     summary: Get all siteInfo
 *     description: Retrieve a list of all siteInfo
 *     tags: [siteInfo]
 *     responses:
 *       200:
 *         description: A list of siteInfo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/siteInfo'
 *       500:
 *         description: Server error
 */
router.get("/", siteInfoController.getAll.bind(siteInfoController));

/**
 * @swagger
 * /siteInfo/{id}:
 *   get:
 *     summary: Get a siteInfo by ID
 *     description: Retrieve a single siteInfo by their ID
 *     tags: [siteInfo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the siteInfo
 *     responses:
 *       200:
 *         description: A single siteInfo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/siteInfo'
 *       400:
 *         description: Invalid siteInfo ID format
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
 *     description: Create a new siteInfo account
 *     tags: [siteInfo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/siteInfo'
 *     responses:
 *       201:
 *         description: siteInfo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/siteInfo'
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
 *     summary: Update a siteInfo by ID
 *     description: Update siteInfo details such as siteInfoname, email, or profile picture
 *     tags: [siteInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the siteInfo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteInfoname:
 *                 type: string
 *               email:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: siteInfo updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: siteInfo not found
 *       500:
 *         description: Server error
 */
router.put("/:id", siteInfoController.update.bind(siteInfoController));

/**
 * @swagger
 * /siteInfo/{id}:
 *   delete:
 *     summary: Delete a siteInfo by ID
 *     description: Remove a siteInfo from the system
 *     tags: [siteInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the siteInfo
 *     responses:
 *       200:
 *         description: siteInfo deleted successfully
 *       404:
 *         description: siteInfo not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", siteInfoController.deleteItem.bind(siteInfoController));



export default router;