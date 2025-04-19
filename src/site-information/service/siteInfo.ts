import { Request, Response } from 'express';
import { fetchSiteInfo } from '../providers/gpt/siteInfo';
import siteInfoModel, { ISiteInfo } from "../models/siteInfo"

export const findSiteInfoByName = async (name: string): Promise<ISiteInfo | null> => {
    return await siteInfoModel.findOne({ name });
  };

export const addSiteInfo = async (body: any): Promise<ISiteInfo | null> => {
  return await siteInfoModel.create(body);
}

export const getSiteDetails = async (siteName: string): Promise<String | null> => {
  try{
    const dbSiteInfo = await findSiteInfoByName(siteName);
    if (dbSiteInfo) {
    console.log(`from DB: ${dbSiteInfo.description}`)
    return dbSiteInfo.description;
    }
    const providerData= await fetchSiteInfo(siteName);
    console.log(`from GPT: ${providerData}`)
    addSiteInfo({
    name: siteName,
    description: providerData
    })
    return providerData;
  } catch (error){
    console.log(error)
    return null;
  }
}