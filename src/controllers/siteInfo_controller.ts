import { Request, Response } from "express";
import BaseController from "./base_controller"; 
import mongoose from "mongoose";
import { fetchSiteInfo } from '../providers/gpt/siteInfoGPT';
import siteInfoModel, { ISiteInfo } from "../models/siteInfo_model";
import { getImageUrl } from '../providers/imageUrl/siteInfoImageUrl';
import {getReviews} from '../providers/comments/googleReviews'

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
      res.status(400).send({ error: "Invalid siteInfo ID format" });
      return;
    }

    try {
      const siteInfo = await this.model.findById(id);
      if (siteInfo) {
        res.status(200).send(siteInfo);
      } else {
        res.status(404).send({ error: "siteInfo not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
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

  async getBySitename(req: Request, res: Response) {
    const siteName = req.params.sitename;
    console.log(siteName)
    try {
      const siteInfo = await this.model.findOne({ name: siteName });
      if (siteInfo) {
        res.status(200).send(siteInfo);
      } else {
        const googleReviews=await getReviews(siteName);
        const providerData= await fetchSiteInfo(siteName);
        const imageUrl= await getImageUrl(siteName)
        const newSiteInfo = await siteInfoModel.create({
          name: siteName,
          description: providerData,
          imageUrl: imageUrl,
          googleReviews: googleReviews
        });
        res.status(200).json(newSiteInfo); 
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

  async addRating(req: Request, res: Response): Promise<void> {
    const siteId = req.params.siteId;
    const userId = req.body.userId;
    const rating = req.body.rating;
  
    try {
      const siteInfo = await this.model.findById(siteId);
      if (!siteInfo) {
        res.status(404).send("SiteInfo not found");
        return;
      }
  
      const existingRating = siteInfo.ratings.find(r => r.userId === userId);
  
      if (existingRating) {
        existingRating.value = rating;
      } else {
        siteInfo.ratings.push({ userId, value: rating }); 
      }
  
      const total = siteInfo.ratings.reduce((sum, r) => sum + r.value, 0);
      const count = siteInfo.ratings.length;
      siteInfo.averageRating = parseFloat((total / count).toFixed(2));
  
      await siteInfo.save();
      res.status(200).send(siteInfo);
  
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
}  

export default new SiteInfoController();
