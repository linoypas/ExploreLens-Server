import express from "express";
import { authMiddleware } from "../controllers/auth_controller";
import placeController from "../controllers/place_controller";
import MockPlaceController from "../controllers/mockPlace_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: API for discovering nearby places around a location
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Place:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - rating
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the place
 *         location:
 *           type: object
 *           description: Geographic coordinates
 *           properties:
 *             lat:
 *               type: number
 *               description: Latitude
 *             lng:
 *               type: number
 *               description: Longitude
 *         rating:
 *           type: number
 *           description: Average user rating
 *         type:
 *           type: string
 *           description: Category of the place
 *         address:
 *           type: string
 *           description: Formatted address
 *         phone_number:
 *           type: string
 *           description: International phone number
 *         business_status:
 *           type: string
 *           description: Operational status (e.g. OPERATIONAL, CLOSED_TEMPORARILY)
 *         opening_hours:
 *           type: object
 *           description: Opening hours details
 *           properties:
 *             open_now:
 *               type: boolean
 *               description: Is it open right now?
 *             weekday_text:
 *               type: array
 *               items:
 *                 type: string
 *               description: Human-readable opening hours per weekday
 *       example:
 *         name: "Joe's Coffee"
 *         location:
 *           lat: 40.712776
 *           lng: -74.005974
 *         rating: 4.3
 *         type: "Cafe"
 *         address: "123 Broadway, New York, NY 10006, USA"
 *         phone_number: "+1 212-555-0123"
 *         business_status: "OPERATIONAL"
 *         opening_hours:
 *           open_now: true
 *           weekday_text:
 *             - "Monday: 7:00 AM – 8:00 PM"
 *             - "Tuesday: 7:00 AM – 8:00 PM"
 */

/**
 * @swagger
 * /places/categories:
 *   get:
 *     summary: Return the list of allowed place categories
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: Array of category strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["restaurant","cafe","bar","bakery","hotel","pharmacy","gym"]
 */
router.get(
    "/categories",
    placeController.getCategories.bind(placeController)
  ); 

/**
 * @swagger
 * /places/nearby/mock:
 *   get:
 *     summary: Get mock nearby places by categories
 *     description: Returns one fake place per category for testing.
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: Array of allowed place types
 *     responses:
 *       200:
 *         description: Array of mock places
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.get(
    "/nearby/mock",
    authMiddleware,
    MockPlaceController.getNearbyPlacesByCategories.bind(MockPlaceController)
  );
  

export default router;