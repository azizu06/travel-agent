import { openai } from "./openai";
import { toolFns, tools } from "./tools";
import type {
  ResponseFunctionToolCall,
  ResponseInputItem,
} from "openai/resources/responses/responses";
import { TripForm, TripPlanSchema } from "./schemas";
import { zodTextFormat } from "openai/helpers/zod";

export const makePlan = async (trip: TripForm) => {
  const input: ResponseInputItem[] = [
    {
      role: "system",
      content: `You are a travel agent, and I want you to plan my itinerary based on the given dates I will give you and the location, going from an origin to a destination. Your job will be to give me:
- the weather forecast for that time
- what potential flights I can book
- what hotels I can book
- some activities I can do based on the time I have available to spend there, along with how the weather is
For anything cost-related, take into account my budget that I have.
        `,
    },
    {
      role: "user",
      content: `Our total group count for the trip we're planning is ${trip.numPeople}, and we are planning to depart at ${trip.depart} and come back at ${trip.arrive}. We are traveling from ${trip.origin} to ${trip.dest}, and our budget for the whole trip is ${trip.budget}.`,
    },
  ];
  let finalResponse;
  while (true) {
    const response = await openai.responses.parse({
      model: "gpt-5-nano",
      tools,
      input,
      text: { format: zodTextFormat(TripPlanSchema, "plan") },
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
