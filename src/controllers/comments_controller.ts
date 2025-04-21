import { Request, Response } from "express";
import BaseController from "./base_controller"; 
import mongoose from "mongoose";
import commentModel from "../models/comment_model";
import { IComment } from "../models/comment_model";
import siteInfoModel from "../models/siteInfo_model";


class commentController extends BaseController<IComment> {
  constructor() {
    super(commentModel);
  }

  async create(req: Request, res: Response) {
    const siteId = req.query.siteId;
    const { owner, content } = req.body;
    try {
      const newComment = await commentModel.create({
        owner: owner,
        content: content,
        siteId: siteId
      });
      const site = await siteInfoModel.findById(siteId);
      if (!site) {
        res.status(404).json({ error: "Site not found" });
        return;
      }
      site.comments.push(newComment._id);
      await site.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ error: "Failed to create chat" });
    }
  }
  async getById(req: Request, res: Response) {
    const commentId = req.params.commentId;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).send({ error: "Invalid comment ID format" });
      return;
    }

    try {
      const comment = await this.model.findById(commentId);
      if (comment) {
        res.status(200).send(comment);
      } else {
        res.status(404).send({ error: "comment not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

  async getBySiteId(req: Request, res: Response) {
    const siteId = req.params.siteId;

    try {
      const comment = await this.model.find({ siteId: siteId});
      if (comment) {
        res.status(200).send(comment);
      } else {
        res.status(404).send({ error: "comment not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

  async update(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const { content } = req.body;
    try {
      const updatedcomment = await this.model.findByIdAndUpdate(
        commentId,
        { content: content }
      );
      if (updatedcomment) {
        res.status(200).send(updatedcomment);
      } else {
        res.status(404).send("comment not found");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
  async delete(req: Request, res: Response) {
    const commentId = req.params.commentId;
    try {
      const deleted = await this.model.findByIdAndDelete(commentId);
      if (deleted) {
        res.status(200).send("Deleted");
      } else {
        res.status(404).send("comment not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new commentController();
