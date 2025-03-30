export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface DetectedObject {
    tag: string;
    confidence: number;
    boundingBox: BoundingBox;
  }
  
  export interface CroppedDetectedObject {
    label: string;
    confidence: number;
    boundingBox: BoundingBox;
    croppedImagePath: string;
  }

  export interface DetectionResult {
    status: 'success' | 'failure' | 'assume';
    description: string;
    siteInformation?: {
      label: string;
      x: number;
      y: number;
      siteName: string;
    };
  }
  