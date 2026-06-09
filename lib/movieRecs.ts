import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";
import type { MovieMatch, Preferences, Session, Movie } from "@/lib/schemas";
import { instructions } from "@/lib/instructions";
import { getPosterUrl } from "@/lib/tmdb";

export const createEmbedding = async (input: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });
  return response.data[0].embedding;
};

const findMatches = async (embedding: number[]) => {
  const { data, error } = await supabase.rpc("match_popmovies", {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 12,
  });
  if (error) throw error;
  return data;
};

const getMovieKey = (movie: Pick<MovieMatch, "title" | "release_year">) =>
  `${movie.title.trim().toLowerCase()}-${movie.release_year}`;

const getChatCompletion = async (text: string, query: string) => {
  const input = `Context: ${text}\nQuery ${query}`;
  const response = await openai.responses.create({
    model: "gpt-5-nano",
    input,
    instructions,
  });
  return response.output_text;
};

export async function* getMovies(
  session: Session,
  prefs: Preferences[],
): AsyncGenerator<Movie> {
  const allPrefs = prefs
    .map((p, i) => {
      return `
      Person ${i + 1}:
      Favorite Movie - ${p.favMovie}
      Movie Era - ${p.era}
      Mood - ${p.mood}
      Favorite Film Person - ${p.favPerson}
    `;
    })
    .join("\n\n");
  const input = `
  Group has ${session.peopleCount} people and ${session.time} available.
  ${allPrefs}
  `;
  const embedding = await createEmbedding(input);
  const matches = await findMatches(embedding);
  if (!matches) return;
  const seen = new Set<string>();
  const uniqueMatches = matches
    .filter((match: MovieMatch) => {
      const key = getMovieKey(match);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 5);
  const pending = uniqueMatches.map((m: MovieMatch) =>
    Promise.all([
      getPosterUrl(m.title, m.release_year),
      getChatCompletion(m.content, input),
    ]).then(([posterUrl, explanation]) => ({
      title: m.title,
      releaseYear: m.release_year,
      posterUrl,
      explanation,
    })),
  );

  while (pending.length > 0) {
    const winner = await Promise.race(
      pending.map((p: Promise<Movie>, i: number) =>
        p.then((movie: Movie) => ({ movie, i })),
      ),
    );
    yield winner.movie;
    pending.splice(winner.i, 1);
  }
}
