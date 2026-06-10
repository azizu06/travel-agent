import { z } from "zod";

export const TripFormSchema = z.object({
  numPeople: z.coerce.number(),
  budget: z.coerce.number(),
  depart: z.string().min(1),
  arrive: z.string().min(1),
  origin: z.string().min(1),
  dest: z.string().min(1),
});

export const TripPlanSchema = TripFormSchema.omit({
  numPeople: true,
  budget: true,
}).extend({
  flights: z.string().min(1),
  weather: z.string().min(1),
  hotel: z.string().min(1),
  activities: z.array(z.string().min(1)),
});

export type TripForm = z.infer<typeof TripFormSchema>;
