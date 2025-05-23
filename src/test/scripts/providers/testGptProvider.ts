import { fetchSiteInfo } from '../../../providers/gpt/siteInfoGPT'

async function testFetchSiteInfo() {
  try {
    const siteName = "Eiffel Tower"; // You can change this to any site name
    const siteInfo = await fetchSiteInfo(siteName);
    console.log('Received site info:', siteInfo);
  } catch (error) {
    console.error('Error during test:', error);
  }
} 


testFetchSiteInfo();