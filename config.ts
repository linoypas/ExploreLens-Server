import dotenv from "dotenv";
dotenv.config();

export const EDENAI_CONFIG = {
    API_KEY: process.env.EDENAI_API_KEY || "",
    ENDPOINTS: {
      LANDMARK_DETECTION: "https://api.edenai.run/v2/image/landmark_detection",
      OBJECT_DETECTION: "https://api.edenai.run/v2/image/object_detection",
    },
  };
  
  if (!EDENAI_CONFIG.API_KEY) {
    throw new Error("EDENAI_API_KEY is not set. Please check .env file.");
  }
  