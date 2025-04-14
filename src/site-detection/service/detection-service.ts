import { Request, Response } from 'express';
import { BoundingBox } from '../models/detectedObjects';
import { fetchLandmarkData } from '../providers/eden_ai/landmarkDetection_provider';
import { RELEVANT_TAGS } from '../../constants/relevantTags';
import { detectObjects } from '../providers/eden_ai/objectDetection_provider';
import { DetectedObject, CroppedDetectedObject, DetectionResult } from '../models/detectedObjects';
import { cropObjectsFromImage } from '../../utils/imageUtility';


async function detectSiteFromImagePath(imagePath: string): Promise<DetectionResult> {
    const fullImageResult = await detectSiteInFullImage(imagePath);
    if (!fullImageResult) {
      return buildFailureResult();
    }
  
    const relevantObjects = await getRelevantObjects(imagePath);
    if (relevantObjects.length === 0) {
      return fullImageResult;
    }
  
    const croppedResult = await detectSiteInCroppedObjects(imagePath, relevantObjects);
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
  
  async function detectSiteInCroppedObjects(imagePath: string, objects: DetectedObject[]): Promise<DetectionResult | null> {
    const croppedObjects: CroppedDetectedObject[] = await cropObjectsFromImage(imagePath, objects);
  
    for (const obj of croppedObjects) {
      const siteName = await fetchLandmarkData(obj.croppedImagePath);
      if (siteName) {
        const center = getCenter(obj.boundingBox);
        return {
          status: 'success',
          description: 'Famous site detected from cropped object.',
          siteInformation: {
            label: obj.label,
            x: center.centerX,
            y: center.centerY,
            siteName,
          },
        };
      }
    }
  
    return null;
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
