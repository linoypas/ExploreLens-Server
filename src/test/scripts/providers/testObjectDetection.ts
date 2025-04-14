import { detectObjects } from "../../../site-detection/providers/eden_ai/objectDetection_provider";

const imagePath = "..\\KikarBialik.jpg";

detectObjects(imagePath)
  .then((objects) => {
    console.log("Detected Objects:", objects);
  })
  .catch((error) => console.error("Unexpected Error:", error));
