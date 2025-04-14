import { EDENAI_CONFIG } from "../../../../config";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { DetectedObject, BoundingBox } from "../../models/detectedObjects";

/**
 * Detects objects in an image using Eden AI's object detection API with Clarifai provider.
 * @param {string} imagePath - The path to the local image file.
 * @returns {Promise<DetectedObject[]>} - A list of detected objects.
 */
export const detectObjects = async (imagePath: string): Promise<DetectedObject[]> => {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error(`File not found: ${imagePath}`);
      return [];
    }

    const formData = new FormData();
    formData.append("providers", "clarifai");
    formData.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(EDENAI_CONFIG.ENDPOINTS.OBJECT_DETECTION, formData, {
      headers: {
        Authorization: `Bearer ${EDENAI_CONFIG.API_KEY}`,
        ...formData.getHeaders(),
      },
    });

    const clarifaiResults = response.data.clarifai?.items || [];

    const detectedObjects: DetectedObject[] = clarifaiResults.map((obj: any) => ({
      tag: obj.label || "Unknown",
      confidence: obj.confidence ?? 0.0,
      boundingBox: {
        x: obj.x_min ?? 0.0,
        y: obj.y_min ?? 0.0,
        width: (obj.x_max ?? 0.0) - (obj.x_min ?? 0.0),
        height: (obj.y_max ?? 0.0) - (obj.y_min ?? 0.0),
      },
    }));

    if (detectedObjects.length > 0) {
      console.log(`Detected ${detectedObjects.length} objects.`);
    } else {
      console.warn("No objects detected.");
    }

    return detectedObjects;
  } catch (error: any) {
    console.error("Error detecting objects:", error.response?.data || error.message);
    return [];
  }
};
