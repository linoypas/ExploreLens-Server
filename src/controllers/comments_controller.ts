import { Request, Response } from "express";
import BaseController from "./base_controller"; 
import mongoose from "mongoose";
import commentModel from "../models/comment_model";
import { IComment } from "../models/comment_model";


class commentController extends BaseController<IComment> {
  constructor() {
    super(commentModel);
  }

  async getAll(req: Request, res: Response) {
    try {
      const items = await this.model.find();
      res.send(items);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ error: "Invalid comment ID format" });
      return;
    }

    try {
      const comment = await this.model.findById(id);
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
    const id = req.params.id;
    const { content } = req.body;
    try {
      const updatedcomment = await this.model.findByIdAndUpdate(
        id,
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
    const { id } = req.params;
    try {
      const deleted = await this.model.findByIdAndDelete(id);
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
