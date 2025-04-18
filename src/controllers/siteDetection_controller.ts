import { Request, Response } from 'express';
import path from 'path';
import { detectSiteFromImagePath } from '../site-detection/service/detection-service';
import { BoundingBox } from '../site-detection/models/detectedObjects';

export const siteInformationController = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const imagePath = path.resolve(req.file.path);
  const result = await detectSiteFromImagePath(imagePath);
  res.status(200).json(result);
};

export const mockSiteInformation = async (req: Request, res: Response): Promise<void> => {
  if (!(req as any).file) {
      res.status(400).json({ error: 'No file uploaded' });
      return
  }
  const boundingBox: BoundingBox = {
      x: 300,
      y: 200,
      width: 100,  
      height: 200,
  };
  const centerX = boundingBox.x + (boundingBox.width / 2);
  const centerY = boundingBox.y + (boundingBox.height / 2);
  res.status(200).json({
  message: 'Image uploaded successfully',
  objects: [
      {
      status: "success",
      description: 'Famous site detected from cropped object.',
      siteInformation: {
        label: "tower",
        x: centerX,
        y: centerY,
        siteName: "Eiffel Tower",
        },
      }
  ]
  });
}
