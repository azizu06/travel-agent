import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="form-screen screen-in"
      style={{ display: "grid", placeItems: "center", minHeight: "100svh" }}
      aria-label="Trip not found"
    >
      <div
        className="card"
        style={{ textAlign: "center", maxWidth: "30rem", width: "min(100% - 2.5rem, 30rem)" }}
      >
        <span
          className="icard-ic"
          style={{ margin: "0 auto var(--s-4)", width: 52, height: 52, borderRadius: "var(--r-md)" }}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" className="i" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5" />
            <path d="M16.5 16.5 21 21" />
            <path d="M8.5 11h5" />
          </svg>
        </span>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--t-h2)" }}>
          Trip not found
        </h2>
        <p className="muted" style={{ margin: "var(--s-3) auto var(--s-6)", maxWidth: "32ch" }}>
          This itinerary doesn&apos;t exist, the link is wrong, or it has expired.
        </p>

        <Link className="btn btn-primary" href="/">
          Plan a new trip
          <svg className="i arr" viewBox="0 0 24 24" width="20" height="20">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
