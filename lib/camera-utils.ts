/**
 * Camera utility functions for subject detection and style prediction
 * These are helper types and utilities, actual API calls should use tRPC hooks in components
 */

export type SubjectType = "Car" | "Portrait" | "Architecture" | "Generic";

export type StyleType =
  | "The Silver Screen"
  | "Classic Chrome"
  | "Portra 400"
  | "Dark Mood"
  | "Editorial Bright"
  | "Eterna";

export interface SubjectDetectionResult {
  subject: SubjectType;
  confidence: number;
}

export interface StylePredictionResult {
  recommendedStyle: StyleType;
  reason: string;
}

/**
 * Upload a camera frame to S3 and get a public URL for AI analysis
 * Note: This is a placeholder. In a real implementation, you would:
 * 1. Capture frame from camera
 * 2. Convert to blob/base64
 * 3. Upload to S3 using server endpoint
 * 4. Return public URL
 */
export async function uploadFrameForAnalysis(frameUri: string): Promise<string> {
  // TODO: Implement actual S3 upload via server endpoint
  // For now, return the local URI (won't work with AI, but allows testing UI)
  return frameUri;
}
