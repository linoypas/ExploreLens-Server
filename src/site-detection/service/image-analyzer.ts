import { Request, Response } from 'express';

const uploadImage = async (req: Request, res: Response): Promise<void> => {
    if (!(req as any).file) {
    res.status(400).json({ error: 'No file uploaded' });
    return
  }

  const { id } = req.body; 

    res.status(200).json({
    message: 'Image uploaded successfully',
    "objects": [
        {
            "id": id,
            "labels": "paris",
            "boundingBox": {
                "x": 300,
                "y": 200,
                "width": 100,
                "height": 200
            }
        }
    ]
    });
}
export default uploadImage;
