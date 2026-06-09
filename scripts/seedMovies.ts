import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";

loadEnvConfig(process.cwd());

const seedData = async (document: string) => {
  const { supabase } = await import("../lib/supabase");
  const { splitter } = await import("../lib/splitter");
  const { createEmbedding } = await import("../lib/movieRecs");

  const data = await readFile(document, "utf-8");
  const sections = data.trim().split("\n\n");
  const movieGroups = await Promise.all(
    sections.map(async (section) => {
      const firstLine = section.split("\n")[0];
      const lastColonIdx = firstLine.lastIndexOf(":");
      const title = firstLine.slice(0, lastColonIdx).trim();
      const details = firstLine.slice(lastColonIdx + 1).trim();
      const releaseYear = Number(details.split("|")[0].trim());
      const chunks = await splitter.createDocuments([section]);
      const rows = await Promise.all(
        chunks.map(async (chunk) => {
          return {
            title,
            release_year: releaseYear,
            content: chunk.pageContent,
            embedding: await createEmbedding(chunk.pageContent),
          };
        }),
      );
      return rows;
    }),
  );
  const movies = movieGroups.flat();
  const titles = [...new Set(movies.map((m) => m.title))];
  const { error: delError } = await supabase
    .from("pop_choice")
    .delete()
    .in("title", titles);
  if (delError) throw delError;
  const { error } = await supabase.from("pop_choice").insert(movies);
  if (error) throw error;
};

seedData("data/movies.txt").catch((error) => {
  console.error(error);
  process.exit(1);
});
