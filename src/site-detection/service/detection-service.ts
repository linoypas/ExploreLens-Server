import { Request, Response } from 'express';
import { BoundingBox } from '../models/detectedObjects';

function getCenter(boundingBox: BoundingBox): { centerX: number; centerY: number } {
    const centerX = boundingBox.x + (boundingBox.width / 2);
    const centerY = boundingBox.y + (boundingBox.height / 2);
    return { centerX, centerY };
  }

const siteInformation = async (req: Request, res: Response): Promise<void> => {
    console.log(`fileeee : ${req.file}`);

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
    const { centerX, centerY } = getCenter(boundingBox);
    res.status(200).json({
    message: 'Image uploaded successfully',
    objects: [
        {
        labels: "paris",
        boundingBox: boundingBox,
        center: {
            x: centerX,
            y: centerY,
          },
        }
    ]
    });
}
export default siteInformation;
