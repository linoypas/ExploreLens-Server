import mongoose from "mongoose";
import siteInfoModel, { ISiteInfo } from "../site-information/models/siteInfoModel"
import { Request, Response } from 'express';
import { findSiteInfoByName, addSiteInfo} from "../site-information/service/siteInfoService";

export const createSiteInfo = async (req: Request, res: Response): Promise<void> => {
    const siteInfoBody = req.body;
    try {
      const siteInfo = await addSiteInfo(siteInfoBody);
      res.status(201).json(siteInfo);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
}

export const getSiteInfoByName = async (req: Request, res: Response): Promise<void> => {
    const siteName = req.params.siteName;

    try {
      const item = await findSiteInfoByName(siteName);
      if (item != null) {
        res.json(item);
      } else {
        res.status(404).json("site not found");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }

export const getAllSiteInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await siteInfoModel.find();
          res.send(items);
    } catch (error) {
        res.status(400).send(error);
    }
 }

// Update
export const updateSiteInfo = async (req: Request, res: Response): Promise<void> => {
    const itemBody = req.body;
    const itemId = req.params.id;
    try {
      const item = await siteInfoModel.findById(itemId);

      if (item != null) {
        for (const key in itemBody) {
          if (itemBody.hasOwnProperty(key)) {
            if (key in item) {
              (item as ISiteInfo)[key as keyof ISiteInfo] = itemBody[key]; 
            }
          }
        }

        await item.save();
        res.status(200).send(item);
      } else {
          res.status(404).send("item not found");
      }   
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
}


// Delete
export const deleteSiteInfo = async (req: Request, res: Response) : Promise<void> => {
    const itemId = req.params.id;
    try {
      const rs = await siteInfoModel.findByIdAndDelete(itemId);
      res.status(200).json(rs);
    } catch (error) {
      res.status(400).json(error);
    }
}
