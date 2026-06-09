import Image from "next/image";
import { useState } from "react";
import Poster from "@/public/poster.png";
import { Movie } from "@/lib/schemas";

export type MoviePageProps = {
  nextMovie: () => void;
  isLast: boolean;
  stillMore: boolean;
  movie: Movie;
};

export default function MoviePage({
  nextMovie,
  movie,
  isLast,
  stillMore,
}: MoviePageProps) {
  const [posterReady, setPosterReady] = useState(!movie.posterUrl);

  return (
    <div
      className={`screen movie-screen${posterReady ? "" : " poster-pending"}`}
    >
      <section className="movie-info">
        <div className="movie-header">
          <h1 className="movie-title">{movie.title}</h1>
          <span className="movie-year">{movie.releaseYear}</span>
        </div>
        <Image
          className="movie-poster"
          src={movie.posterUrl ?? Poster}
          alt={`${movie.title} poster`}
          width={325}
          height={462}
          onLoad={() => setPosterReady(true)}
        />
        <p className="movie-copy">{movie.explanation}</p>
      </section>
      <button
        className="primary-button movie-button"
        disabled={stillMore}
        onClick={() => nextMovie()}
      >
        {stillMore ? "Loading More..." : isLast ? "Reset" : "Next Movie"}
      </button>
    </div>
  );
}
