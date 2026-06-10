import { openai } from "./openai";
import { toolFns, tools } from "./tools";
import type {
  ResponseFunctionToolCall,
  ResponseInputItem,
} from "openai/resources/responses/responses";
import { TripForm, GeneratedPlanSchema } from "./schemas";
import { zodTextFormat } from "openai/helpers/zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

export const makePlanV1 = async (trip: TripForm) => {
  const input: ResponseInputItem[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: buildUserPrompt(trip),
    },
  ];
  let finalResponse;
  for (let i = 0; i < 5; i++) {
    const response = await openai.responses.parse({
      model: "gpt-5-nano",
      tools,
      input,
      text: { format: zodTextFormat(GeneratedPlanSchema, "plan") },
    });
    const calls = response.output.filter(
      (o) => o.type === "function_call",
    ) as ResponseFunctionToolCall[];
    if (calls.length === 0) {
      finalResponse = response.output_parsed;
      break;
    }
    for (const call of calls) {
      const args = JSON.parse(call.arguments);
      const result = await toolFns[call.name as keyof typeof toolFns](args);
      input.push(call);
      input.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      });
    }
  }
  return finalResponse;
};
