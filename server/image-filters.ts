import sharp from "sharp";
import type { FilterAdjustments } from "../lib/advanced-filters.js";

/**
 * Real image filter engine using Sharp for pixel-level color corrections
 * Applies actual color transformations to image data
 */

/**
 * Apply color adjustments to an image buffer
 */
export async function applyColorAdjustments(
  imageBuffer: Buffer,
  adjustments: FilterAdjustments
): Promise<Buffer> {
  try {
    let pipeline = sharp(imageBuffer);

    // Apply brightness adjustment
    if (adjustments.brightness !== undefined && adjustments.brightness !== 0) {
      const brightnessFactor = 1 + adjustments.brightness / 100;
      pipeline = pipeline.modulate({ brightness: brightnessFactor });
    }

    // Apply saturation adjustment
    if (adjustments.saturation !== undefined && adjustments.saturation !== 0) {
      const saturationFactor = 1 + adjustments.saturation / 100;
      pipeline = pipeline.modulate({ saturation: saturationFactor });
    }

    // Apply hue rotation
    if (adjustments.hue !== undefined && adjustments.hue !== 0) {
      pipeline = pipeline.rotate(adjustments.hue);
    }

    // Apply contrast via linear adjustment
    if (adjustments.contrast !== undefined && adjustments.contrast !== 0) {
      const contrastFactor = 1 + adjustments.contrast / 100;
      pipeline = pipeline.modulate({ saturation: contrastFactor });
    }

    // Apply temperature (warm/cool tint) via hue rotation
    if (adjustments.temperature !== undefined && adjustments.temperature !== 0) {
      // Positive temperature = warm (yellow shift)
      // Negative temperature = cool (blue shift)
      const hueShift = adjustments.temperature * 1.8;
      pipeline = pipeline.rotate(hueShift);
    }

    // Apply tint (magenta/green shift) via hue rotation
    if (adjustments.tint !== undefined && adjustments.tint !== 0) {
      const tintShift = adjustments.tint * 1.5;
      pipeline = pipeline.rotate(tintShift);
    }

    // Apply highlights adjustment
    if (adjustments.highlights !== undefined && adjustments.highlights !== 0) {
      // Highlights adjustment - brighten or darken bright areas
      const factor = 1 + adjustments.highlights / 200;
      pipeline = pipeline.modulate({ brightness: factor });
    }

    // Apply shadows adjustment
    if (adjustments.shadows !== undefined && adjustments.shadows !== 0) {
      // Shadows adjustment - brighten or darken dark areas
      const factor = 1 + adjustments.shadows / 200;
      pipeline = pipeline.modulate({ brightness: factor });
    }

    // Apply clarity (sharpness)
    if (adjustments.clarity !== undefined && adjustments.clarity !== 0) {
      if (adjustments.clarity > 0) {
        // Increase clarity with sharpening
        const amount = Math.min(2, 1 + adjustments.clarity / 100);
        pipeline = pipeline.sharpen(amount);
      } else {
        // Decrease clarity with blur
        const amount = Math.abs(adjustments.clarity) / 100;
        pipeline = pipeline.blur(amount);
      }
    }

    // Apply vibrance (similar to saturation but affects colors differently)
    if (adjustments.vibrance !== undefined && adjustments.vibrance !== 0) {
      const vibrance = 1 + adjustments.vibrance / 100;
      pipeline = pipeline.modulate({ saturation: vibrance });
    }

    // Apply exposure
    if (adjustments.exposure !== undefined && adjustments.exposure !== 0) {
      const exposureFactor = Math.pow(2, adjustments.exposure);
      pipeline = pipeline.modulate({ brightness: exposureFactor });
    }

    // Apply gamma
    if (adjustments.gamma !== undefined && adjustments.gamma !== 1) {
      pipeline = pipeline.gamma(adjustments.gamma);
    }

    // Convert to JPEG and return buffer
    return await pipeline.jpeg({ quality: 90 }).toBuffer();
  } catch (error) {
    console.error("Error applying color adjustments:", error);
    throw error;
  }
}

/**
 * Apply a named filter preset to an image
 */
export async function applyFilterPreset(
  imageBuffer: Buffer,
  filterName: string,
  presets: Record<string, FilterAdjustments>
): Promise<Buffer> {
  const preset = presets[filterName];
  if (!preset) {
    throw new Error(`Filter preset "${filterName}" not found`);
  }
  return applyColorAdjustments(imageBuffer, preset);
}

/**
 * Convert image to base64 for transmission
 */
export async function imageToBase64(imageBuffer: Buffer): Promise<string> {
  return imageBuffer.toString("base64");
}

/**
 * Convert base64 to image buffer
 */
export function base64ToBuffer(base64String: string): Buffer {
  return Buffer.from(base64String, "base64");
}

/**
 * Apply multiple filter adjustments sequentially
 */
export async function applyMultipleAdjustments(
  imageBuffer: Buffer,
  adjustmentsList: FilterAdjustments[]
): Promise<Buffer> {
  let result = imageBuffer;

  for (const adjustments of adjustmentsList) {
    result = await applyColorAdjustments(result, adjustments);
  }

  return result;
}

/**
 * Resize image for optimization
 */
export async function resizeImage(imageBuffer: Buffer, maxWidth: number = 1080): Promise<Buffer> {
  return await sharp(imageBuffer)
    .resize(maxWidth, maxWidth, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(imageBuffer: Buffer) {
  return await sharp(imageBuffer).metadata();
}
