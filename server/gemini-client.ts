import axios from "axios";

/**
 * Gemini API client for scene analysis and voice interpretation
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface GeminiContent {
  role: "user" | "model";
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
}

/**
 * Analyze a scene image and describe its contents
 */
export async function analyzeScene(imageBase64: string): Promise<{
  subject: string;
  environment: string;
  lighting: string;
  colors: string[];
  recommendations: string[];
}> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze this image and provide a detailed description in JSON format with these fields:
- subject: main subject in the image (e.g., "red car", "person", "landscape")
- environment: surrounding environment (e.g., "cloudy cliff with water and fog")
- lighting: lighting conditions (e.g., "overcast, soft shadows")
- colors: array of dominant colors
- recommendations: array of photography recommendations for this scene

Respond ONLY with valid JSON, no other text.`,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      },
      {
        timeout: 30000,
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(content);

    return {
      subject: parsed.subject || "unknown",
      environment: parsed.environment || "unknown",
      lighting: parsed.lighting || "unknown",
      colors: parsed.colors || [],
      recommendations: parsed.recommendations || [],
    };
  } catch (error) {
    console.error("Error analyzing scene:", error);
    throw error;
  }
}

/**
 * Interpret voice command and generate filter adjustments
 */
export async function interpretVoiceCommand(
  voiceText: string,
  sceneContext: {
    subject: string;
    environment: string;
    colors: string[];
  }
): Promise<{
  intent: string;
  adjustments: Record<string, number>;
  explanation: string;
}> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a professional photography AI assistant. The user is editing a photo with the following scene:
- Subject: ${sceneContext.subject}
- Environment: ${sceneContext.environment}
- Colors: ${sceneContext.colors.join(", ")}

The user said: "${voiceText}"

Based on their request, provide JSON with:
- intent: what the user wants (e.g., "enhance_red", "brighten_sky", "reduce_shadows")
- adjustments: object with filter adjustments (saturation, vibrance, contrast, brightness, temperature, tint, highlights, shadows, clarity, hue - all -100 to 100 range)
- explanation: brief explanation of what you're doing

Respond ONLY with valid JSON, no other text.`,
              },
            ],
          },
        ],
      },
      {
        timeout: 30000,
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(content);

    return {
      intent: parsed.intent || "unknown",
      adjustments: parsed.adjustments || {},
      explanation: parsed.explanation || "",
    };
  } catch (error) {
    console.error("Error interpreting voice command:", error);
    throw error;
  }
}

/**
 * Generate filter recommendations based on scene analysis
 */
export async function generateFilterRecommendations(sceneAnalysis: {
  subject: string;
  environment: string;
  lighting: string;
  colors: string[];
}): Promise<{
  recommendedStyle: string;
  adjustments: Record<string, number>;
  reasoning: string;
}> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a professional photography AI. Based on this scene analysis, recommend the best color grading approach:

Scene:
- Subject: ${sceneAnalysis.subject}
- Environment: ${sceneAnalysis.environment}
- Lighting: ${sceneAnalysis.lighting}
- Colors: ${sceneAnalysis.colors.join(", ")}

Provide JSON with:
- recommendedStyle: name of recommended style (e.g., "The Silver Screen", "Portra 400")
- adjustments: object with recommended filter adjustments (saturation, vibrance, contrast, brightness, temperature, tint, highlights, shadows, clarity - all -100 to 100 range)
- reasoning: explanation of why these adjustments work for this scene

Respond ONLY with valid JSON, no other text.`,
              },
            ],
          },
        ],
      },
      {
        timeout: 30000,
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(content);

    return {
      recommendedStyle: parsed.recommendedStyle || "Classic Chrome",
      adjustments: parsed.adjustments || {},
      reasoning: parsed.reasoning || "",
    };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
}

/**
 * Validate that Gemini API key is configured
 */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.startsWith("AIza");
}
