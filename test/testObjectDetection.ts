import { detectObjects } from "../src/site-detection/providers/eden_ai/objectDetectionProvider";

const imagePath = ".\\test\\KikarBialik.jpg";

detectObjects(imagePath)
  .then((objects) => {
    console.log("Detected Objects:", objects);
  })
  .catch((error) => console.error("Unexpected Error:", error));
