import { EDENAI_CONFIG } from "../../../../config";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from 'dotenv';

dotenv.config();

export const fetchLandmarkData = async (imagePath: string): Promise<string> => {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error(`File not found: ${imagePath}`);
      return "";
    }

    const formData = new FormData();
    formData.append("providers", "google");
    formData.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(EDENAI_CONFIG.ENDPOINTS.LANDMARK_DETECTION, formData, {
      headers: {
        Authorization: `Bearer ${EDENAI_CONFIG.API_KEY}`,
        ...formData.getHeaders(),
      },
    });

    const landmark = response.data.google?.items?.[0]?.description || "";

    if (landmark) {
      console.log(`Detected Landmark: ${landmark}`);
    } else {
      console.warn("No landmark detected.");
    }

    return landmark;
  } catch (error: any) {
    console.error("Error fetching landmark data:", error.response?.data || error.message);
    return "";
  }
};
