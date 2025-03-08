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
  