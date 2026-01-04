/**
 * Advanced image filters with real color correction and adjustments
 * These filters provide professional-grade color grading capabilities
 */

export interface FilterAdjustments {
  saturation?: number; // -100 to 100
  vibrance?: number; // -100 to 100
  contrast?: number; // -100 to 100
  brightness?: number; // -100 to 100
  temperature?: number; // -50 to 50 (warm to cool)
  tint?: number; // -50 to 50 (magenta to green)
  highlights?: number; // -100 to 100
  shadows?: number; // -100 to 100
  clarity?: number; // -100 to 100
  hue?: number; // -180 to 180
  exposure?: number; // -2 to 2
  gamma?: number; // 0.5 to 2.0
}

/**
 * Predefined filter presets with color correction values
 */
export const ADVANCED_FILTERS = {
  "The Silver Screen": {
    saturation: 15,
    vibrance: 25,
    contrast: 30,
    brightness: 5,
    temperature: -10,
    tint: 5,
    highlights: 10,
    shadows: -5,
    clarity: 15,
  } as FilterAdjustments,

  "Classic Chrome": {
    saturation: -30,
    vibrance: 10,
    contrast: 20,
    brightness: 0,
    temperature: 0,
    tint: 0,
    highlights: 5,
    shadows: 10,
    clarity: 10,
  } as FilterAdjustments,

  "Portra 400": {
    saturation: 10,
    vibrance: 20,
    contrast: 10,
    brightness: 8,
    temperature: 25,
    tint: -10,
    highlights: 15,
    shadows: 5,
    clarity: 5,
  } as FilterAdjustments,

  "Dark Mood": {
    saturation: -10,
    vibrance: 0,
    contrast: 40,
    brightness: -25,
    temperature: -5,
    tint: 0,
    highlights: -20,
    shadows: 30,
    clarity: 20,
  } as FilterAdjustments,

  "Editorial Bright": {
    saturation: 5,
    vibrance: 15,
    contrast: 15,
    brightness: 15,
    temperature: 5,
    tint: 0,
    highlights: 25,
    shadows: -10,
    clarity: 25,
  } as FilterAdjustments,

  Eterna: {
    saturation: -25,
    vibrance: 5,
    contrast: 10,
    brightness: -5,
    temperature: 10,
    tint: 5,
    highlights: 5,
    shadows: 15,
    clarity: 10,
  } as FilterAdjustments,
};

/**
 * Apply color correction adjustments to create filter effects
 * Returns CSS filter string or adjustment parameters for image processing
 */
export function generateFilterCSS(adjustments: FilterAdjustments): string {
  const filters: string[] = [];

  if (adjustments.brightness !== undefined) {
    filters.push(`brightness(${100 + adjustments.brightness}%)`);
  }
  if (adjustments.contrast !== undefined) {
    filters.push(`contrast(${100 + adjustments.contrast}%)`);
  }
  if (adjustments.saturation !== undefined) {
    filters.push(`saturate(${100 + adjustments.saturation}%)`);
  }
  if (adjustments.temperature !== undefined) {
    // Warm (positive) adds red/yellow, cool (negative) adds blue
    const warmth = adjustments.temperature;
    if (warmth > 0) {
      filters.push(`sepia(${Math.abs(warmth) / 100})`);
    } else {
      filters.push(`hue-rotate(${warmth * 1.8}deg)`);
    }
  }
  if (adjustments.hue !== undefined) {
    filters.push(`hue-rotate(${adjustments.hue}deg)`);
  }

  return filters.join(" ");
}

/**
 * Convert voice command to filter adjustments
 * Example: "make the red stand out" -> increase saturation and vibrance
 */
export function parseVoiceCommandToAdjustments(command: string): Partial<FilterAdjustments> {
  const lowerCommand = command.toLowerCase();
  const adjustments: Partial<FilterAdjustments> = {};

  // Color enhancement
  if (lowerCommand.includes("stand out") || lowerCommand.includes("pop")) {
    adjustments.saturation = 30;
    adjustments.vibrance = 40;
    adjustments.contrast = 20;
  }

  // Red enhancement
  if (lowerCommand.includes("red") && (lowerCommand.includes("enhance") || lowerCommand.includes("stand out"))) {
    adjustments.hue = 0; // Focus on red channel
    adjustments.saturation = 40;
    adjustments.vibrance = 50;
  }

  // Sky enhancement
  if (lowerCommand.includes("sky") || lowerCommand.includes("blue")) {
    adjustments.saturation = 25;
    adjustments.contrast = 15;
    adjustments.temperature = -20;
  }

  // Shadow reduction
  if (lowerCommand.includes("shadow") && lowerCommand.includes("reduce")) {
    adjustments.shadows = -30;
    adjustments.highlights = 10;
    adjustments.exposure = 0.5;
  }

  // Vibrance increase
  if (lowerCommand.includes("vibrance") || lowerCommand.includes("vivid")) {
    adjustments.vibrance = 50;
    adjustments.saturation = 20;
  }

  // Warm colors
  if (lowerCommand.includes("warm") || lowerCommand.includes("golden")) {
    adjustments.temperature = 30;
    adjustments.tint = -10;
    adjustments.saturation = 10;
  }

  // Cool colors
  if (lowerCommand.includes("cool") || lowerCommand.includes("blue")) {
    adjustments.temperature = -30;
    adjustments.tint = 10;
  }

  // Increase contrast
  if (lowerCommand.includes("contrast") || lowerCommand.includes("punchy")) {
    adjustments.contrast = 30;
    adjustments.clarity = 25;
  }

  // Reduce noise/increase clarity
  if (lowerCommand.includes("sharp") || lowerCommand.includes("clarity")) {
    adjustments.clarity = 40;
    adjustments.vibrance = 10;
  }

  // Brightness
  if (lowerCommand.includes("bright") || lowerCommand.includes("lighter")) {
    adjustments.brightness = 20;
    adjustments.exposure = 0.5;
  }

  if (lowerCommand.includes("dark") || lowerCommand.includes("darker")) {
    adjustments.brightness = -20;
    adjustments.exposure = -0.5;
  }

  // Background adjustments
  if (lowerCommand.includes("background")) {
    if (lowerCommand.includes("blur")) {
      adjustments.clarity = -30;
    }
    if (lowerCommand.includes("enhance")) {
      adjustments.saturation = 20;
    }
  }

  return adjustments;
}

/**
 * Merge multiple filter adjustments intelligently
 */
export function mergeAdjustments(
  base: FilterAdjustments,
  additional: Partial<FilterAdjustments>
): FilterAdjustments {
  const merged = { ...base };

  Object.entries(additional).forEach(([key, value]) => {
    if (value !== undefined) {
      const currentValue = merged[key as keyof FilterAdjustments] || 0;
      // Blend adjustments rather than replace
      merged[key as keyof FilterAdjustments] = (currentValue + value) / 2;
    }
  });

  return merged;
}

/**
 * Clamp adjustment values to valid ranges
 */
export function clampAdjustments(adjustments: FilterAdjustments): FilterAdjustments {
  const clamped = { ...adjustments };

  if (clamped.saturation !== undefined) clamped.saturation = Math.max(-100, Math.min(100, clamped.saturation));
  if (clamped.vibrance !== undefined) clamped.vibrance = Math.max(-100, Math.min(100, clamped.vibrance));
  if (clamped.contrast !== undefined) clamped.contrast = Math.max(-100, Math.min(100, clamped.contrast));
  if (clamped.brightness !== undefined) clamped.brightness = Math.max(-100, Math.min(100, clamped.brightness));
  if (clamped.temperature !== undefined) clamped.temperature = Math.max(-50, Math.min(50, clamped.temperature));
  if (clamped.tint !== undefined) clamped.tint = Math.max(-50, Math.min(50, clamped.tint));
  if (clamped.highlights !== undefined) clamped.highlights = Math.max(-100, Math.min(100, clamped.highlights));
  if (clamped.shadows !== undefined) clamped.shadows = Math.max(-100, Math.min(100, clamped.shadows));
  if (clamped.clarity !== undefined) clamped.clarity = Math.max(-100, Math.min(100, clamped.clarity));
  if (clamped.hue !== undefined) clamped.hue = ((clamped.hue % 360) + 360) % 360;
  if (clamped.exposure !== undefined) clamped.exposure = Math.max(-2, Math.min(2, clamped.exposure));
  if (clamped.gamma !== undefined) clamped.gamma = Math.max(0.5, Math.min(2.0, clamped.gamma));

  return clamped;
}
