import { fetchLandmarkData } from "../../../site-detection/providers/eden_ai/landmarkDetectionProvider"; 

const testImageUrl = "..\\KikarBialik.jpg"; 

async function testProvider() {
  try {
    const landmark = await fetchLandmarkData(testImageUrl);
    console.log("Detected Landmark:", landmark || "No landmark detected");
  } catch (error) {
    console.error("Error during test:", error);
  }
}

testProvider();
