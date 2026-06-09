"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import SessionForm from "@/components/sessionForm";
import PrefForm from "@/components/prefForm";
import MoviePage from "@/components/movie";
import type { Preferences, Session, Movie } from "@/lib/schemas";
import Popcorn from "@/public/popcorn.png";

export default function Home() {
  const [step, setStep] = useState("setup");
  const [isPending, startTransition] = useTransition();
  const [isScreenExiting, setIsScreenExiting] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [prefs, setPrefs] = useState<Preferences[]>([]);
  const [recs, setRecs] = useState<Movie[]>([]);
  const [prefIdx, setPrefIdx] = useState(1);
  const [recIdx, setRecIdx] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const curMovie = recs[recIdx];
  const screenTransitionMs = 170;

  const changeScreen = (update: () => void) => {
    if (isScreenExiting) return;
    setIsScreenExiting(true);
    window.setTimeout(() => {
      update();
      setIsScreenExiting(false);
    }, screenTransitionMs);
  };

  const handleSetup = (data: Session) => {
    changeScreen(() => {
      setSession(data);
      setStep("prefs");
    });
  };

  const readStream = async (res: Response) => {
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value);
      const lines = buffer.split("\n");
      buffer = lines.pop()!;
      for (const line of lines) {
        if (!line) continue;
        const movie = JSON.parse(line);
        setRecs((prev) => [...prev, movie]);
      }
    }
  };

  const handlePrefs = (data: Preferences) => {
    if (!session || isScreenExiting) return;
    const allPrefs = [...prefs, data];
    if (allPrefs.length !== session.peopleCount) {
      changeScreen(() => {
        setPrefs(allPrefs);
        setPrefIdx((prev) => prev + 1);
      });
      return;
    }
    changeScreen(() => {
      startTransition(async () => {
        const response = await fetch("/api/recs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session, prefs: allPrefs }),
        });
        setStep("results");
        setStreaming(true);
        await readStream(response);
        setStreaming(false);
        setPrefs(allPrefs);
      });
    });
  };

  const resetAll = () => {
    changeScreen(() => {
      setSession(null);
      setPrefs([]);
      setRecs([]);
      setRecIdx(0);
      setPrefIdx(1);
      setStep("setup");
    });
  };

  const nextMovie = () => {
    if (recIdx == recs.length - 1) {
      if (streaming) return;
      return resetAll();
    }
    changeScreen(() => {
      setRecIdx((prev) => prev + 1);
    });
  };

  return (
    <main className={`app-shell ${isScreenExiting ? "is-screen-exiting" : ""}`}>
      {step === "setup" && <SessionForm handleSubmit={handleSetup} />}

      {step === "prefs" && !isPending && (
        <PrefForm
          key={prefIdx}
          handleSubmit={handlePrefs}
          isLast={prefIdx === session?.peopleCount}
          isPending={isPending || isScreenExiting}
          prefIdx={prefIdx}
          totalCount={session?.peopleCount ?? 1}
        />
      )}

      {isPending && step !== "results" && (
        <div key="loading" className="screen loading-screen">
          <div className="loading-content">
            <Image
              src={Popcorn}
              alt="loading"
              className="popcorn-logo"
              priority
            />
            <p className="loading-headline">Curating your picks…</p>
            <div className="loading-dots">
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </div>
          </div>
        </div>
      )}

      {step === "results" && curMovie && (
        <MoviePage
          key={`${recIdx}-${curMovie.title}`}
          nextMovie={nextMovie}
          movie={curMovie}
          isLast={!streaming && recs.length - 1 === recIdx}
          stillMore={streaming && recs.length - 1 === recIdx}
        />
      )}

      {step === "results" && !curMovie && (
        <div key="empty" className="screen empty-screen">
          <section className="empty-info">
            <h1 className="movie-title">No matches found</h1>
            <p className="movie-copy empty-copy">
              Try adjusting the group preferences so PopChoice has more to work
              with.
            </p>
          </section>
          <button className="primary-button movie-button" onClick={resetAll}>
            Try Again
          </button>
        </div>
      )}
    </main>
  );
}
