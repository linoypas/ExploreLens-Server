import sharp from "sharp";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { BoundingBox, DetectedObject, CroppedDetectedObject } from "../site-detection/models/detectedObjects";

function toAbsoluteBox(bbox: BoundingBox, imageWidth: number, imageHeight: number) {
  const left = Math.floor(bbox.x * imageWidth);
  const top = Math.floor(bbox.y * imageHeight);
  const right = Math.floor((bbox.x + bbox.width) * imageWidth);
  const bottom = Math.floor((bbox.y + bbox.height) * imageHeight);
  const width = right - left;
  const height = bottom - top;
  return { left, top, width, height };
}

export async function cropObjectsFromImage(
  imagePath: string,
  objects: DetectedObject[]
): Promise<CroppedDetectedObject[]> {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  const imageWidth = metadata.width || 0;
  const imageHeight = metadata.height || 0;

  if (imageWidth === 0 || imageHeight === 0) {
    throw new Error("Invalid image dimensions");
  }

  const outputDir = path.join(__dirname, "..", "cropped");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const originalName = path.basename(imagePath, path.extname(imagePath));
  const croppedResults: CroppedDetectedObject[] = [];

  for (const obj of objects) {
    const { left, top, width, height } = toAbsoluteBox(obj.boundingBox, imageWidth, imageHeight);

    if (width <= 0 || height <= 0 || left < 0 || top < 0 || left + width > imageWidth || top + height > imageHeight) {
      console.warn(`Skipping object "${obj.tag}" due to invalid crop:`, { left, top, width, height });
      continue;
    }

    const outputFilePath = path.join(outputDir, `${originalName}-crop-${uuidv4()}.jpg`);

    try {
      await image
        .extract({ left, top, width, height })
        .toFile(outputFilePath);

      croppedResults.push({
        label: obj.tag,
        confidence: obj.confidence,
        boundingBox: obj.boundingBox,
        croppedImagePath: outputFilePath,
      });
    } catch (err) {
      console.error(`Failed to crop "${obj.tag}"`, err);
    }
  }

  return croppedResults;
}
