import { Request, Response } from "express";
import BaseController from "./base_controller"; 
import mongoose from "mongoose";
import reviewModel from "../models/review_model";
import { IReview } from "../models/review_model";
import siteInfoModel from "../models/siteInfo_model";


class reviewController extends BaseController<IReview> {
  constructor() {
    super(reviewModel);
  }

  async create(req: Request, res: Response) {
    const siteId = req.params.siteId;
    const { userId, content } = req.body;
    try {
      const newreview = await reviewModel.create({
        userId: userId,
        content: content,
        siteId: siteId
      });
      const site = await siteInfoModel.findById(siteId);
      if (!site) {
        res.status(404).json({ error: "Site not found" });
        return;
      }
      site.reviewsIds.push(newreview._id);
      await site.save();
      res.status(201).json(newreview);
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: "Failed to create review" });
    }
  }
  async getById(req: Request, res: Response) {
    const reviewId = req.params.reviewId;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).send({ error: "Invalid review ID format" });
      return;
    }

    try {
      const review = await this.model.findById(reviewId);
      if (review) {
        res.status(200).send(review);
      } else {
        res.status(404).send({ error: "review not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }

  async getBySiteId(req: Request, res: Response) {
    const siteId = req.params.siteId;

    try {
      const review = await this.model.find({ siteId: siteId});
      if (review) {
        res.status(200).send(review);
      } else {
        res.status(404).send({ error: "review not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }
  
  async update(req: Request, res: Response) {
    const reviewId = req.params.reviewId;
    const content  = req.body.content;
    console.log(content)
    try {
      const updatedreview = await this.model.findByIdAndUpdate(
        reviewId,
        { content: content },
        { new: true }
      );
      if (updatedreview) {
        res.status(200).send(updatedreview);
      } else {
        res.status(404).send("review not found");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
  async delete(req: Request, res: Response) {
    const reviewId = req.params.reviewId;
    try {
      const deleted = await this.model.findByIdAndDelete(reviewId);
      if (deleted) {
        res.status(200).send("Deleted");
      } else {
        res.status(404).send("review not found");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new reviewController();
