import * as ImageManipulator from "expo-image-manipulator";
import type { StyleType } from "./camera-utils";

/**
 * Color grading filters simulating professional LUT (Lookup Table) effects
 * Each filter applies specific adjustments to mimic professional color grading
 */

interface FilterParams {
  brightness?: number; // -1 to 1
  contrast?: number; // -1 to 1
  saturation?: number; // -1 to 1
  tint?: { r: number; g: number; b: number }; // RGB tint overlay
}

/**
 * Filter configurations for each professional style
 */
const FILTER_CONFIGS: Record<StyleType, FilterParams> = {
  "The Silver Screen": {
    // High contrast, teal & orange split tone
    contrast: 0.3,
    saturation: 0.2,
    tint: { r: 1.05, g: 1.0, b: 1.1 }, // Slight teal/orange tint
  },
  "Classic Chrome": {
    // Desaturated, punchy mid-tones
    contrast: 0.2,
    saturation: -0.3,
    brightness: 0.05,
    tint: { r: 1.0, g: 1.0, b: 1.0 },
  },
  "Portra 400": {
    // Warm golden tones
    brightness: 0.1,
    saturation: 0.1,
    tint: { r: 1.15, g: 1.05, b: 0.95 }, // Warm tint
  },
  "Dark Mood": {
    // Low exposure, deep shadows
    brightness: -0.25,
    contrast: 0.4,
    saturation: -0.1,
    tint: { r: 1.0, g: 0.95, b: 1.0 },
  },
  "Editorial Bright": {
    // High dynamic range, clean whites
    brightness: 0.15,
    contrast: 0.15,
    saturation: 0.05,
    tint: { r: 1.0, g: 1.0, b: 1.0 },
  },
  Eterna: {
    // Cinematic, low-saturation
    brightness: -0.05,
    contrast: 0.1,
    saturation: -0.25,
    tint: { r: 1.0, g: 1.02, b: 1.05 }, // Slight cool tint
  },
};

/**
 * Apply a professional color grading style to an image
 * @param imageUri - URI of the image to process
 * @param style - Professional style to apply
 * @returns URI of the processed image
 */
export async function applyFilter(imageUri: string, style: StyleType): Promise<string> {
  try {
    const config = FILTER_CONFIGS[style];

    // Build manipulation actions
    const actions: ImageManipulator.Action[] = [];

    // Note: expo-image-manipulator has limited filter support
    // For production, consider using react-native-image-filter-kit or custom shaders

    // Resize to optimize processing (optional)
    // actions.push({ resize: { width: 1080 } });

    // Apply basic adjustments (limited by expo-image-manipulator API)
    // The library doesn't support brightness/contrast/saturation directly
    // So we'll save the image as-is for now and note this limitation

    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      actions,
      {
        compress: 0.9,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return result.uri;
  } catch (error) {
    console.error("Error applying filter:", error);
    // Return original image if filter fails
    return imageUri;
  }
}

/**
 * Get filter preview (for style carousel thumbnails)
 * Returns a description of what the filter does
 */
export function getFilterDescription(style: StyleType): string {
  const descriptions: Record<StyleType, string> = {
    "The Silver Screen": "High contrast with teal & orange tones. Perfect for modern cars and urban scenes.",
    "Classic Chrome": "Desaturated colors with punchy mid-tones. Documentary film aesthetic.",
    "Portra 400": "Warm golden tones with natural skin. Ideal for portraits and lifestyle.",
    "Dark Mood": "Low exposure with deep shadows. Dramatic with vibrant primary colors.",
    "Editorial Bright": "High dynamic range with clean whites. Sharp architectural details.",
    Eterna: "Cinematic low-saturation with rich shadow detail. Film-like quality.",
  };

  return descriptions[style];
}

/**
 * Batch process multiple images with the same filter
 */
export async function batchApplyFilter(
  imageUris: string[],
  style: StyleType
): Promise<string[]> {
  const results = await Promise.all(imageUris.map((uri) => applyFilter(uri, style)));
  return results;
}

/**
 * Note: For production-quality color grading, consider:
 * 1. Using react-native-image-filter-kit for advanced filters
 * 2. Implementing custom WebGL shaders for real LUT application
 * 3. Using native modules for GPU-accelerated processing
 * 4. Pre-generating LUT files and applying them via shaders
 *
 * Current implementation is a placeholder that demonstrates the workflow.
 * Real LUT application requires:
 * - 3D LUT files (.cube format)
 * - Shader-based pixel manipulation
 * - GPU acceleration for real-time preview
 */
