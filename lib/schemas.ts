import { z } from "zod";

export const TripFormSchema = z.object({
  numPeople: z.coerce.number().min(1).max(20),
  budget: z.coerce.number().min(0).max(1_000_000),
  depart: z.string().min(1).max(20),
  arrive: z.string().min(1).max(20),
  origin: z.string().min(1).max(80).trim(),
  dest: z.string().min(1).max(80).trim(),
});

// What the model is asked to generate (structured so the UI can render rich
// lists instead of walls of text). Counts are guided by the prompt, not hard
// min/max bounds, so a slightly-off response still validates.
export const GeneratedPlanSchema = z.object({
  weather: z.object({
    summary: z.string().min(1),
    highF: z.number(),
    lowF: z.number(),
    conditions: z.array(z.string().min(1)),
  }),
  flights: z.array(
    z.object({
      airline: z.string().min(1),
      route: z.string().min(1), // e.g. "JFK → LIS · 1 stop · ~9h"
      priceUsd: z.number(), // per traveller
      note: z.string().min(1),
    }),
  ),
  hotels: z.array(
    z.object({
      name: z.string().min(1),
      area: z.string().min(1),
      pricePerNightUsd: z.number(),
      note: z.string().min(1),
    }),
  ),
  activities: z.array(
    z.object({
      title: z.string().min(1),
      detail: z.string().min(1),
    }),
  ),
});

export const FinalPlanSchema = TripFormSchema.omit({
  numPeople: true,
  budget: true,
}).extend({ ...GeneratedPlanSchema.shape, destUrl: z.url() });

export type TripForm = z.infer<typeof TripFormSchema>;
