import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { analyzeScene, interpretVoiceCommand, generateFilterRecommendations, isGeminiConfigured } from "./gemini-client.js";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Camera AI features
  camera: router({
    detectSubject: publicProcedure
      .input(
        z.object({
          imageUrl: z.string().url(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert photography assistant that analyzes images to detect the primary subject. Classify the image into one of these categories: Car (vehicles, automobiles), Portrait (people, faces), Architecture (buildings, structures), or Generic (everything else). Respond with ONLY the category name.",
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "What is the primary subject in this image? Respond with ONLY one word: Car, Portrait, Architecture, or Generic.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: input.imageUrl,
                      detail: "low",
                    },
                  },
                ],
              },
            ],
            max_tokens: 10,
          });

          const content = response.choices[0].message.content;
          const detectedSubject = typeof content === "string" ? content.trim() : "Generic";
          const validSubjects = ["Car", "Portrait", "Architecture", "Generic"];
          const subject = validSubjects.includes(detectedSubject) ? detectedSubject : "Generic";

          return {
            subject: subject as "Car" | "Portrait" | "Architecture" | "Generic",
            confidence: 0.85,
          };
        } catch (error) {
          console.error("Error detecting subject:", error);
          return {
            subject: "Generic" as const,
            confidence: 0.5,
          };
        }
      }),

    predictBestStyle: publicProcedure
      .input(
        z.object({
          subject: z.enum(["Car", "Portrait", "Architecture", "Generic"]),
        })
      )
      .query(({ input }) => {
        const styleMap: Record<
          string,
          "The Silver Screen" | "Classic Chrome" | "Portra 400" | "Dark Mood" | "Editorial Bright" | "Eterna"
        > = {
          Car: "The Silver Screen",
          Portrait: "Portra 400",
          Architecture: "Editorial Bright",
          Generic: "Classic Chrome",
        };

        return {
          recommendedStyle: styleMap[input.subject],
          reason: `Best for ${input.subject.toLowerCase()} photography`,
        };
      }),
  }),

  // Gemini AI endpoints for advanced scene analysis and voice commands
  gemini: router({
    analyzeScene: publicProcedure
      .input(z.object({ imageBase64: z.string() }))
      .mutation(async ({ input }) => {
        if (!isGeminiConfigured()) {
          throw new Error("Gemini API not configured");
        }
        return await analyzeScene(input.imageBase64);
      }),

    interpretVoice: publicProcedure
      .input(
        z.object({
          voiceText: z.string(),
          subject: z.string(),
          environment: z.string(),
          colors: z.array(z.string()),
        })
      )
      .mutation(async ({ input }) => {
        if (!isGeminiConfigured()) {
          throw new Error("Gemini API not configured");
        }
        return await interpretVoiceCommand(input.voiceText, {
          subject: input.subject,
          environment: input.environment,
          colors: input.colors,
        });
      }),

    getRecommendations: publicProcedure
      .input(
        z.object({
          subject: z.string(),
          environment: z.string(),
          lighting: z.string(),
          colors: z.array(z.string()),
        })
      )
      .query(async ({ input }) => {
        if (!isGeminiConfigured()) {
          throw new Error("Gemini API not configured");
        }
        return await generateFilterRecommendations({
          subject: input.subject,
          environment: input.environment,
          lighting: input.lighting,
          colors: input.colors,
        });
      }),

    isConfigured: publicProcedure.query(() => {
      return { configured: isGeminiConfigured() };
    }),
  }),
});

export type AppRouter = typeof appRouter;
