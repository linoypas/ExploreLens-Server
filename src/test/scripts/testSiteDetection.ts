import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { detectSiteFromImagePath } from '../../site-detection/service/detection-service'; 

dotenv.config();

const testImagePath = path.resolve(__dirname, 'BeitHatzamut.jpg'); 
async function main() {
  if (!fs.existsSync(testImagePath)) {
    console.error(`Image not found at path: ${testImagePath}`);
    process.exit(1);
  }

  console.log(`Starting site detection for: ${testImagePath}`);

  try {
    const result = await detectSiteFromImagePath(testImagePath);

    console.log(`Detection Result:\n${JSON.stringify(result, null, 2)}`);
  } catch (error) {
    console.error('Error during detection:', error);
  }
}

main();
