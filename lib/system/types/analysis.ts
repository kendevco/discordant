export interface ValueEstimate {
  amount: number;
  currency: string;
  confidence: number;
}

export interface ImageAnalysis {
  content: string;
  objects: string[];
  categories: string[];
  inventoryType?: string;
  valueEstimate?: ValueEstimate;
}

export type AnalysisResult = string | ImageAnalysis;
