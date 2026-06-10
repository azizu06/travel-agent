import { z } from "zod";

export const TripFormSchema = z.object({
  numPeople: z.coerce.number().min(1).max(20),
  budget: z.coerce.number().min(0).max(1_000_000),
  depart: z.string().min(1).max(20),
  arrive: z.string().min(1).max(20),
  origin: z.string().min(1).max(80).trim(),
  dest: z.string().min(1).max(80).trim(),
});

export const GeneratedPlanSchema = z.object({
  flights: z.string().min(1),
  weather: z.string().min(1),
  hotel: z.string().min(1),
  activities: z.array(z.string().min(1)),
});

export const FinalPlanSchema = TripFormSchema.omit({
  numPeople: true,
  budget: true,
}).extend({ ...GeneratedPlanSchema.shape, destUrl: z.url() });

export type TripForm = z.infer<typeof TripFormSchema>;
