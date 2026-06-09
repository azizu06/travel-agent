export const getPosterUrl = async (title: string, releaseYear: number) => {
  const params = new URLSearchParams({
    query: title,
    year: String(releaseYear),
    include_adult: "false",
    language: "en-US",
    page: "1",
  });
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?${params}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    },
  );
  if (!response.ok) throw new Error("TMDB request failed");
  const data = await response.json();
  const posterPath = data.results?.[0]?.poster_path;
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};
