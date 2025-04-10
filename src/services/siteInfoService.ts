import { Request, Response } from 'express';
import { fetchSiteInfo } from '../site-detection/providers/gpt/siteInfo_provider';
import { ISiteInfo } from '../models/siteInfoModel'
import { getSiteInfoByName } from '../controllers/SiteInfoController'


async function siteInformation(siteName: string): Promise<String | null> {
    const dbSiteInfo = await getSiteInfoByName(siteName);
    if (dbSiteInfo) {
      return dbSiteInfo.description;
    }
    const gptInfo = await fetchSiteInfo(siteName);
    if (gptInfo) {
      return gptInfo;
    }
    return null;
  }  


export {siteInformation} ;
