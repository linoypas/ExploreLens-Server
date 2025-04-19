import { Request, Response } from "express";
import BaseController from "./base_controller"; 
import mongoose from "mongoose";
import { fetchSiteInfo } from '../providers/gpt/siteInfo';
import siteInfoModel, { ISiteInfo } from "../models/siteInfo_model";



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

  async getBySitename(req: Request, res: Response) {
    const siteName = req.params.sitename;
    console.log(siteName)
    try {
      const siteInfo = await this.model.findOne({ name: siteName });
      if (siteInfo) {
        res.status(200).send(siteInfo);
      } else {
        const providerData= await fetchSiteInfo(siteName);
        const newSiteInfo = await siteInfoModel.create({
          name: siteName,
          description: providerData,
        });
        console.log(newSiteInfo)
        res.status(200).json(newSiteInfo); 
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  }
}

export default new SiteInfoController();
