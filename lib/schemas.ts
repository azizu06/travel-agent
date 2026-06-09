import { z } from "zod";

export const SessionSchema = z.object({
  peopleCount: z.coerce.number().int().min(1),
  time: z.string().min(1),
});

export type Session = z.infer<typeof SessionSchema>;

export const PreferencesSchema = z.object({
  favMovie: z.string().min(1),
  era: z.enum(["new", "classic"]),
  mood: z.enum(["fun", "serious", "inspiring", "scary"]),
  favPerson: z.string().min(1),
});

export type Preferences = z.infer<typeof PreferencesSchema>;

export type Movie = {
  title: string;
  releaseYear: number;
  posterUrl: string | null;
  explanation: string;
};

export type MovieMatch = {
  id: number;
  title: string;
  release_year: number;
  content: string;
  similarity: number;
};

export const RecBodySchema = z.object({
  session: SessionSchema,
  prefs: z.array(PreferencesSchema),
});
