import { openai } from "@ai-sdk/openai";
import { getWeather } from "./tools";
import { generateText, tool, stepCountIs, Output } from "ai";
import { TripForm, TripPlanSchema } from "./schemas";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

export const makePlanV2 = async (trip: TripForm) => {
  const { output } = await generateText({
    model: openai.responses("gpt-5-nano"),
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(trip),
    tools: {
      getWeather: tool({
        description: "Given a city, find the weather data.",
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }) => getWeather(city),
      }),
    },
    output: Output.object({ schema: TripPlanSchema }),
    stopWhen: stepCountIs(5),
  });
  return output;
};
