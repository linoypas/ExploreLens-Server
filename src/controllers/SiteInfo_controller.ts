import { Request, Response } from "express";
import BaseController from "./base_controller"; 
import { ISiteInfo } from "../site-information/models/siteInfo";
import mongoose from "mongoose";
import siteInfoModel from "../site-information/models/siteInfo";

class SiteInfoController extends BaseController<ISiteInfo> {
  constructor() {
    super(siteInfoModel);
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
      res.status(400).send({ error: "Invalid user ID format" });
      return;
    }

    try {
      const user = await this.model.findById(id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

  async getBySitename(req: Request, res: Response) {
    const { siteName } = req.params;

    try {
      const user = await this.model.findOne({ siteName });
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ error: "Site not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const { username, profilePicture } = req.body;

    if (username) {
      const existingUser = await this.model.findOne({ username, _id: { $ne: id } });
      if (existingUser) {
        res.status(400).send({ error: "Username is already taken" });
        return;
      }
    }

    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        id,
        { username, profilePicture },
        { new: true, runValidators: true }
      );

      if (updatedUser) {
        res.status(200).send(updatedUser);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
}

export default new SiteInfoController();
