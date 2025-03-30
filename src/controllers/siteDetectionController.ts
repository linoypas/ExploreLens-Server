import { Request, Response } from 'express';
import path from 'path';
import { detectSiteFromImagePath } from '../site-detection/service/detection-service';

export const siteInformationController = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const imagePath = path.resolve(req.file.path);
  const result = await detectSiteFromImagePath(imagePath);
  res.status(200).json(result);
};
