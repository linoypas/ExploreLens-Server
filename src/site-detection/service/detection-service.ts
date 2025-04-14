import { BoundingBox } from '../models/detectedObjects';
import { fetchLandmarkData } from '../providers/eden_ai/landmarkDetection_provider';
import { RELEVANT_TAGS } from '../../constants/relevantTags';
import { detectObjects } from '../providers/eden_ai/objectDetection_provider';
import { DetectedObject, DetectionResult } from '../models/detectedObjects';
import { getCentralAndLargestObjects } from '../../utils/imageUtility';


async function detectSiteFromImagePath(imagePath: string): Promise<DetectionResult> {
    const fullImageResult = await detectSiteInFullImage(imagePath);
    if (!fullImageResult) {
      return buildFailureResult();
    }
  
    const relevantObjects = await getRelevantObjects(imagePath);
    if (relevantObjects.length === 0) {
      return fullImageResult;
    }
  
    const croppedResult = await detectSiteInCroppedObjects(relevantObjects, fullImageResult.siteInformation?.siteName || '');
    if (croppedResult) {
      return croppedResult;
    }
  
    return fullImageResult;
  }  

async function detectSiteInFullImage(imagePath: string): Promise<DetectionResult | null> {
    const siteName = await fetchLandmarkData(imagePath);
    if (!siteName) return null;
  
    return {
      status: 'assume',
      description: 'Famous site detected in full image.',
      siteInformation: {
        label: 'full-image',
        x: 0.5,
        y: 0.5,
        siteName : siteName,
      },
    };
  }
    
  async function getRelevantObjects(imagePath: string): Promise<DetectedObject[]> {
    const allObjects = await detectObjects(imagePath);
    const relevantTags = Object.values(RELEVANT_TAGS).flat().map(tag => tag.toLowerCase());
    return allObjects.filter(obj => relevantTags.includes(obj.tag.toLowerCase()));
  }
  
function getThebiggestCentralObject(objects: DetectedObject[]): DetectedObject | undefined {
    if (objects.length === 0) return undefined;

    const prioritizedObjects = getCentralAndLargestObjects(objects);
    const mostCentralBiggest = prioritizedObjects[0];
    return mostCentralBiggest;
}

  async function detectSiteInCroppedObjects(objects: DetectedObject[], siteName: string): Promise<DetectionResult | null> {  
    const centralBiggestObject = getThebiggestCentralObject(objects);
    if (!centralBiggestObject) return null;

    const center = getCenter(centralBiggestObject.boundingBox);
    return {
      status: 'success',
      description: 'Famous site detected from cropped object.',
      siteInformation: {
        label: centralBiggestObject.tag,
        x: center.centerX,
        y: center.centerY,
        siteName,
      },
    };
  }
  
  function buildFailureResult(): DetectionResult {
    return {
      status: 'failure',
      description: 'No famous site detected and no relevant objects found.',
    };
  }
  
  function getCenter(boundingBox: BoundingBox): { centerX: number; centerY: number } {
    const centerX = boundingBox.x + (boundingBox.width / 2);
    const centerY = boundingBox.y + (boundingBox.height / 2);
    return { centerX, centerY };
  } 
  
export {detectSiteFromImagePath} ;
