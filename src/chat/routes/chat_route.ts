import express from "express";
import { authMiddleware } from "../../controllers/auth_controller";
import chatController from "../controllers/chat_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat endpoints for historical site discussions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - topic
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *         topic:
 *           type: string
 *           description: The topic of the chat (historical site)
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         messages:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of message IDs
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         topic: "Colosseum, Rome"
 *         userId: "60d0fe4f5311236168a109cb"
 *         messages: ["60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109cd"]
 */

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a new chat about a historical site
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - userId
 *             properties:
 *               topic:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat created
 *       400:
 *         description: Failed to create chat
 */
router.post("/", authMiddleware, chatController.createChat.bind(chatController));

/**
 * @swagger
 * /chats/{id}:
 *   delete:
 *     summary: Delete a chat by ID
 *     tags: [Chat]
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
 *         description: Chat deleted
 *       404:
 *         description: Chat not found
 */
router.delete("/:id", authMiddleware, chatController.deleteChat.bind(chatController));

/**
 * @swagger
 * /chats/{id}:
 *   get:
 *     summary: Get a chat by ID (includes populated messages)
 *     tags: [Chat]
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
 *         description: Chat details
 *       404:
 *         description: Chat not found
 */
router.get("/:id", authMiddleware, chatController.getChatById.bind(chatController));

/**
 * @swagger
 * /chats/user/{userId}:
 *   get:
 *     summary: Get chats for a user (topics only, no messages)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of chats
 */
router.get("/user/:userId", authMiddleware, chatController.getChatsByUserId.bind(chatController));

/**
 * @swagger
 * /chats/message:
 *   post:
 *     summary: Send a message to the chat and get GPT reply
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - userId
 *               - data
 *             properties:
 *               chatId:
 *                 type: string
 *               userId:
 *                 type: string
 *               data:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message and reply created
 *       500:
 *         description: Failed to handle message
 */
router.post("/message", authMiddleware, chatController.createUserMessage.bind(chatController));

export default router;
