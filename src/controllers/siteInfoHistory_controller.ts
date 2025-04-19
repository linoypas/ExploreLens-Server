import { Request, Response } from "express";
import BaseController from "./base_controller";
import siteInfoHistoryModel, { ISiteInfoHistory } from "../models/siteinfo_history_model";
import mongoose from "mongoose";

class SiteInfoHistoryController extends BaseController<ISiteInfoHistory> {
  constructor() {
    super(siteInfoHistoryModel);
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
      res.status(400).send({ error: "Invalid ID format" });
      return;
    }

    try {
      const item = await this.model.findById(id);
      if (item) {
        res.status(200).send(item);
      } else {
        res.status(404).send({ error: "Not found" });
      }
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }

  async getByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const items = await this.model.find({ userId });
      res.status(200).send(items);
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }

  async getBySiteId(req: Request, res: Response) {
    const { siteInfoId } = req.params;
    try {
      const items = await this.model.find({ siteInfoId });
      res.status(200).send(items);
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }

  async getByDateRange(req: Request, res: Response) {
    const { start, end } = req.query;
    if (!start || !end) {
      res.status(400).send({ error: "Missing date range parameters" });
      return;
    }

    try {
      const items = await this.model.find({
        createdAt: {
          $gte: new Date(start as string),
          $lte: new Date(end as string)
        }
      });
      res.status(200).send(items);
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }

  async getByUserAndSiteRange(req: Request, res: Response) {
    const { userId, siteInfoId, start, end } = req.query;
    if (!userId || !siteInfoId || !start || !end) {
      res.status(400).send({ error: "Missing required query parameters" });
      return;
    }

    try {
      const items = await this.model.find({
        userId,
        siteInfoId,
        createdAt: {
          $gte: new Date(start as string),
          $lte: new Date(end as string)
        }
      });
      res.status(200).send(items);
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newItem = await this.model.create(req.body);
      res.status(201).send(newItem);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, { new: true });
      if (updatedItem) {
        res.status(200).send(updatedItem);
      } else {
        res.status(404).send("Item not found");
      }
    } catch (error) {
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
        res.status(404).send("Item not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new SiteInfoHistoryController();
