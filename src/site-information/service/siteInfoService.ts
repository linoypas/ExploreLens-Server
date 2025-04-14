import { Request, Response } from 'express';
import { fetchSiteInfo } from '../../site-detection/providers/gpt/siteInfo_provider';
import siteInfoModel, { ISiteInfo } from "../models/siteInfoModel"

export const findSiteInfoByName = async (name: string): Promise<ISiteInfo | null> => {
    return await siteInfoModel.findOne({ name });
  };

export const siteDetails = async (siteName: string): Promise<String> => {
  const dbSiteInfo = await findSiteInfoByName(siteName);
  if (dbSiteInfo) {
    console.log(`from DB: ${dbSiteInfo.description}`)
    return dbSiteInfo.description;
  }
  const providerData= await fetchSiteInfo(siteName);
  console.log(`from GPT: ${providerData}`)
  return providerData;
}