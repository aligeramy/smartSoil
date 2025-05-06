export interface FeatureItem {
  id: string;
  name: string;
}

export interface ModelMetrics {
  features: string[];
  accuracy: number;
  specificity: number;
  sensitivity: number;
  auc: number | string;
  precision: number | string;
  f1: number | string;
  confusionMatrix: {
    "True Positive": number;
    "True Negative": number;
    "False Positive": number;
    "False Negative": number;
  };
} 