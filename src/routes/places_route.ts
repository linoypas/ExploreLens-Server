import express from "express";
import { authMiddleware } from "../controllers/auth_controller";
import placeController from "../controllers/place_controller";

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
 *         - elevation
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the place
 *         location:
 *           type: object
 *           description: Geographic coordinates
 *           required:
 *             - lat
 *             - lng
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
 *         elevation:
 *           type: number
 *           description: Elevation in meters above sea level
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
 *         editorial_summary:
 *           type: string
 *           description: Google’s short, human-written summary of the place
 *         website:
 *           type: string
 *           description: The place’s official website URL
 *         price_level:
 *           type: integer
 *           format: int32
 *           description: Price level (0 free — 4 very expensive)
 *         reviews:
 *           type: array
 *           description: Top user reviews for the place
 *           items:
 *             type: object
 *             properties:
 *               author_name:
 *                 type: string
 *               rating:
 *                 type: number
 *               relative_time_description:
 *                 type: string
 *               text:
 *                 type: string
 *               time:
 *                 type: integer
 *                 description: Unix timestamp
 *       example:
 *         name: "Joe's Coffee"
 *         location:
 *           lat: 40.712776
 *           lng: -74.005974
 *         rating: 4.3
 *         type: "cafe"
 *         elevation: 15.2
 *         address: "123 Broadway, New York, NY 10006, USA"
 *         phone_number: "+1 212-555-0123"
 *         business_status: "OPERATIONAL"
 *         opening_hours:
 *           open_now: true
 *           weekday_text:
 *             - "Monday: 7:00 AM – 8:00 PM"
 *         editorial_summary: "A cozy neighborhood coffee shop known for artisanal espresso."
 *         website: "https://joescoffee.example.com"
 *         price_level: 2
 *         reviews:
 *           - author_name: "Alice"
 *             rating: 5
 *             relative_time_description: "2 weeks ago"
 *             text: "Fantastic vibes and great lattes!"
 *             time: 1616161616
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
 *               example: ["restaurant","cafe","bar","bakery","lodging","pharmacy","gym"]
 */
router.get(
  "/categories",
  placeController.getCategories.bind(placeController)
);

/**
 * @swagger
 * /places/nearby:
 *   get:
 *     summary: Get nearby places by categories
 *     description: |
 *       Retrieve all places within a fixed radius (e.g. 500 m) of the given latitude and longitude for one or more categories.
 *       Categories must be one of the allowed values (Restaurant, Cafe, Bar, Bakery, Lodging, Pharmacy, Gym).
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of user's current location
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of user's current location
 *       - in: query
 *         name: categories
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: |
 *           One or more place types to search for.  
 *           Allowed values: restaurant, cafe, bar, bakery, lodging, pharmacy, gym
 *     responses:
 *       '200':
 *         description: Array of places matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       '400':
 *         description: Invalid input (e.g. missing or malformed parameters)
 *       '500':
 *         description: Server error
 */

router.get("/nearby", authMiddleware, placeController.getNearbyPlacesByCategories.bind(placeController));   

export default router;