import { Request, Response } from 'express';
import { fetchSiteInfo } from '../site-detection/providers/gpt/siteInfo_provider';

export const siteGptDetailsController = async (req: Request, res: Response): Promise<void> => {
    const siteName = req.query.siteName as string; 
    console.log(`siteName : ${siteName}`);
  if (!siteName) {
    res.status(400).json({ error: 'No site mentioned' });
    return;
  }
  const result = await fetchSiteInfo(siteName);
  res.status(200).json(result);
};

export const siteGptMockDetailsController = async (req: Request, res: Response): Promise<void> => {
    const siteName = req.query.siteName as string; 
    console.log(`siteName : ${siteName}`);
  if (!siteName) {
    res.status(400).json({ error: 'No site mentioned' });
    return;
  }
  const result = "The Eiffel Tower, located in Paris, France, is one of the most iconic landmarks in the world. Completed in 1889 as the centerpiece of the 1889 World's Fair, it was designed by engineer Gustave Eiffel. Standing at 330 meters tall, the tower was initially criticized but has since become a symbol of French culture and a major tourist attraction, drawing millions of visitors each year. Made of iron, it was the tallest man-made structure in the world until the completion of the Chrysler Building in New York in 1930. Today, it remains a stunning architectural marvel and a symbol of romance and elegance.";
  res.status(200).json(result);
};

