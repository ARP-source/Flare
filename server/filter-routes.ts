import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc.js";
import { applyColorAdjustments, base64ToBuffer, imageToBase64 } from "./image-filters.js";
import { ADVANCED_FILTERS } from "../lib/advanced-filters.js";
import type { FilterAdjustments } from "../lib/advanced-filters.js";

/**
 * Filter application routes for real image processing
 */
export const filterRouter = router({
  /**
   * Apply custom color adjustments to an image
   */
  applyAdjustments: publicProcedure
    .input(
      z.object({
        imageBase64: z.string(),
        adjustments: z.record(z.string(), z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const imageBuffer = base64ToBuffer(input.imageBase64);
        const adjustments = (input.adjustments || {}) as FilterAdjustments;

        const filteredBuffer = await applyColorAdjustments(imageBuffer, adjustments);
        const resultBase64 = await imageToBase64(filteredBuffer);

        return {
          success: true,
          imageBase64: resultBase64,
          appliedAdjustments: adjustments,
        };
      } catch (error) {
        console.error("Error applying adjustments:", error);
        throw error;
      }
    }),

  /**
   * Apply a named filter preset to an image
   */
  applyPreset: publicProcedure
    .input(
      z.object({
        imageBase64: z.string(),
        filterName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const preset = ADVANCED_FILTERS[input.filterName as keyof typeof ADVANCED_FILTERS];
        if (!preset) {
          throw new Error(`Filter preset "${input.filterName}" not found`);
        }

        const imageBuffer = base64ToBuffer(input.imageBase64);
        const filteredBuffer = await applyColorAdjustments(imageBuffer, preset);
        const resultBase64 = await imageToBase64(filteredBuffer);

        return {
          success: true,
          imageBase64: resultBase64,
          filterName: input.filterName,
          appliedAdjustments: preset,
        };
      } catch (error) {
        console.error("Error applying preset:", error);
        throw error;
      }
    }),

  /**
   * Get available filter presets
   */
  getPresets: publicProcedure.query(() => {
    return {
      presets: Object.keys(ADVANCED_FILTERS).map((name) => ({
        name,
        adjustments: ADVANCED_FILTERS[name as keyof typeof ADVANCED_FILTERS],
      })),
    };
  }),
});
