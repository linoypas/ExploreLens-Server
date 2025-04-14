import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
  model: Model<T>;
  constructor(model: any) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const filter = req.query.userId;
    try {
      if (filter) {
        const item = await this.model.find({ userId: filter });
        res.send(item);
      } else {
        const items = await this.model.find();
        res.send(items);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const item = await this.model.findById(id);
      if (item != null) {
        res.send(item);
      } else {
        res.status(404).send("not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async create(req: Request, res: Response) {
    const body = req.body;
    try {
      const item = await this.model.create(body);
      res.status(201).send(item);
    } catch (error) {
      console.log(error);

      res.status(400).send(error);
    }
  }

  async deleteItem(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const rs = await this.model.findByIdAndDelete(id);
      if (!rs) {
        res.status(404).send({ error: "Item not found" });
      } else {
        res.status(200).send("deleted");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const updates = req.body;
    try {
      const updatedItem = await this.model.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (updatedItem) {
        res.status(200).send(updatedItem);
      } else {
        res.status(404).send("not found");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}

export default BaseController;
