import { Request, Response } from "express";
import BaseController from "./base_controller"; 
import mongoose from "mongoose";
import { fetchSiteInfo } from '../providers/gpt/siteInfoGPT';
import siteInfoModel, { ISiteInfo } from "../models/siteInfo_model";
import reviewModel, { IReview } from "../models/review_model";
import { getImageUrl } from '../providers/imageUrl/siteInfoImageUrl';
import {getReviews} from '../providers/reviews/googleReviews'

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

  async update(req: Request, res: Response) {
    const id = req.params.siteId;
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

  async getById(req: Request, res: Response) {
    const id = req.params.siteId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send({ error: "Invalid siteInfo ID format" });
      return;
    }
    try {
      const siteInfo = await this.model.findById(id);
      if (siteInfo && siteInfo.description) {
        res.status(200).send(siteInfo);
        return;
      } else {
        if(siteInfo){
        const googleData=await getReviews(siteInfo.name);
        const providerData= await fetchSiteInfo(siteInfo.name);
        const imageUrl= await getImageUrl(siteInfo.name)
        const ratings = (googleData || []).map((review, index) => ({
          userId: `google-${index}`, 
          value: review.rating
        }));
        const averageRating = ratings.length > 0
        ? parseFloat((ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2))
        : 0;
          siteInfo.description = providerData;
          siteInfo.imageUrl = imageUrl;
          siteInfo.ratings = ratings;
          siteInfo.averageRating = averageRating;
          if (googleData && googleData.length > 0) {
            const googleReviews = googleData.map((review) => ({
              owner: review.author_name,
              content: review.text,
              date: new Date(review.time * 1000),
              siteId: siteInfo._id,
            }));
    
            const insertedReviews = await reviewModel.insertMany(googleReviews);
            const googleReviewsID = insertedReviews.map((review) => review._id);

            siteInfo.reviews = googleReviewsID;
          }
        await siteInfo.save();
        res.status(200).json(siteInfo); 
        } else{
          res.status(404).send({ error: "site not found" });
        }
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
  async getReducedSiteInfo(req: Request, res: Response) {
    const siteId = req.params.siteId;
  
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      res.status(400).json({ error: "Invalid site ID format" });
      return;
    }
  
    try {
      const site = await siteInfoModel.findById(siteId).select("-reviews");
  
      if (!site) {
        res.status(404).json({ error: "Site not found" });
        return;
      }
  
      res.status(200).json(site);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve site info" });
    }
  }
  async delete(req: Request, res: Response) {
    const siteId = req.params.siteId;
    try {
      const deleted = await siteInfoModel.findByIdAndDelete(siteId);
      if (deleted) {
        res.status(200).send("Deleted");
      } else {
        res.status(404).send("site not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}  

export default new SiteInfoController();
