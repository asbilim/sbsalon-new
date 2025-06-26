import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 60;

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await streamText({
      model: openrouter(
        process.env.OPENROUTER_MODEL ||
          "mistralai/mistral-small-3.2-24b-instruct:free"
      ),
      prompt,
      temperature: process.env.AI_TEMPERATURE
        ? parseFloat(process.env.AI_TEMPERATURE)
        : 0.8,
    });

    return new Response(result.textStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Error in AI generation:", error);

    // Default error details
    let statusCode = 500;
    let message = "An unexpected error occurred during AI generation.";
    let metadata;

    // The AI SDK might wrap the original error. Let's try to find it.
    // OpenRouter errors are often in `error.cause` or `error.data`.
    const openRouterError = error.cause || error.data || error;

    if (openRouterError && openRouterError.error) {
      statusCode = openRouterError.error.code || 500;
      message = openRouterError.error.message || message;
      metadata = openRouterError.error.metadata;
    } else if (error.message) {
      // Fallback to the top-level error message
      message = error.message;
    }

    const errorResponse = {
      error: {
        code: statusCode,
        message: message,
        ...(metadata && { metadata }), // Conditionally add metadata if it exists
      },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
}
