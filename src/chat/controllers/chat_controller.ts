import { Request, Response } from "express";
import ChatModel from "../models/chat_model";
import MessageModel from "../models/message_model";
import { getChatResponse } from "../providers/chatgpt_provider"; 
import mongoose, { Types } from "mongoose";

class ChatController {
  async createChat(req: Request, res: Response) {
    const { topic, userId } = req.body;
    try {
      const newChat = await ChatModel.create({
        topic,
        userId: new mongoose.Types.ObjectId(userId),
        messages: [],
      });
      res.status(201).json(newChat);
    } catch (error) {
      res.status(400).json({ error: "Failed to create chat" });
    }
  }

  async deleteChat(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedChat = await ChatModel.findByIdAndDelete(id);
      if (deletedChat) {
        res.status(200).send("Chat deleted");
      } else {
        res.status(404).json({ error: "Chat not found" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid chat ID" });
    }
  }

  async getChatById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const chat = await ChatModel.findById(id).populate("messages");
      if (chat) {
        res.status(200).json(chat);
      } else {
        res.status(404).json({ error: "Chat not found" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid chat ID" });
    }
  }

  async getChatsByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const chats = await ChatModel.find({ userId: new mongoose.Types.ObjectId(userId) });
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async createUserMessage(req: Request, res: Response) {
    const { chatId, userId, data } = req.body;
    try {
      const chat = await ChatModel.findById(new mongoose.Types.ObjectId(chatId));
      if (!chat) {
         res.status(404).json({ error: "Chat not found" });
         return;
      }

      const userMessage = await MessageModel.create({
        data,
        sender: "user",
      });

      chat.messages.push(userMessage._id as Types.ObjectId);

      const gptReply = await getChatResponse(chat.topic, data);

      const systemMessage = await MessageModel.create({
        data: gptReply,
        sender: "system",
      });

      chat.messages.push(systemMessage._id as Types.ObjectId);

      await chat.save();

      res.status(201).json({ userMessage, systemMessage });
    } catch (error) {
      console.error("Failed to create user message:", error);
      res.status(500).json({ error: "Failed to handle message" });
    }
  }
}

export default new ChatController();
