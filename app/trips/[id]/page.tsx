import Link from "next/link";
import Image from "next/image";
import { redis } from "@/lib/redis";
import { FinalPlanSchema } from "@/lib/schemas";
import ShareButton from "@/components/shareButton";
import ThemeToggle from "@/components/themeToggle";
import { notFound } from "next/navigation";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtRange = (a: string, b: string) => {
  const [ya, ma, da] = a.split("-").map(Number);
  const [yb, mb, db] = b.split("-").map(Number);
  if (!ya || !ma || !da || !yb || !mb || !db) return `${a} – ${b}`;
  const right = `${MONTHS[mb - 1]} ${db}, ${yb}`;
  return ya === yb
    ? `${MONTHS[ma - 1]} ${da} – ${right}`
    : `${MONTHS[ma - 1]} ${da}, ${ya} – ${right}`;
};

// Capitalise the first letter of each word (users may type "new york").
const titleCase = (s: string) =>
  s.replace(/(^|\s)(\p{L})/gu, (_, sp, c) => sp + c.toUpperCase());

export default async function TripPlan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await redis.get(`travel:${id}`);
  const { data: trip, success } = FinalPlanSchema.safeParse(raw);
  if (!success) notFound();
  const { weather, flights, hotels, activities } = trip;

  return (
    <main className="itin-screen screen-in" aria-label="Your itinerary">
      <section className="itin-hero">
        <div className="itin-hero-photo">
          <Image
            src={trip.destUrl}
            alt={`Photo of ${trip.dest}`}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="itin-hero-scrim" aria-hidden="true" />

        <header className="topbar on-sky itin-topbar">
          <Link className="brand" href="/" aria-label="Meridian home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
                <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeOpacity="0.5" />
                <path d="M16 3 C9 11 9 21 16 29 C23 21 23 11 16 3Z" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3 16 H29" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="16" cy="16" r="2.4" fill="var(--gold)" />
              </svg>
            </span>
            <span className="brand-name">
              <b>Meri</b>dian
            </span>
          </Link>
          <div className="topbar-actions">
            <ThemeToggle />
          </div>
        </header>

        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <div className="itin-hero-content">
            <span className="eyebrow" style={{ color: "var(--gold)" }}>
              Your itinerary · drafted by Meridian
            </span>
            <h1 className="itin-route">
              <span>{titleCase(trip.origin)}</span>
              <em className="arrow" aria-label="to">
                →
              </em>
              <span>{titleCase(trip.dest)}</span>
            </h1>
            <div className="itin-meta">
              <span className="chip">
                <svg className="i i-sm" viewBox="0 0 24 24">
                  <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
                  <path d="M3 9h18M8 2.5v4M16 2.5v4" />
                </svg>
                <span>{fmtRange(trip.depart, trip.arrive)}</span>
              </span>
            </div>
            <div className="itin-actions">
              <ShareButton />
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="itin-body">
          {/* Weather */}
          <article className="icard span-2">
            <div className="icard-head">
              <span className="icard-ic">
                <svg className="i i-md" viewBox="0 0 24 24">
                  <circle cx="9" cy="9" r="3.4" />
                  <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4" />
                  <path d="M22 18a3 3 0 0 0-3-3 4.2 4.2 0 0 0-8 .2A3.2 3.2 0 0 0 11.5 21H19a3 3 0 0 0 3-3Z" />
                </svg>
              </span>
              <h3>Weather</h3>
            </div>
            <p>{weather.summary}</p>
            <div className="wx">
              <div className="wx-temp">
                <b>{Math.round(weather.highF)}°</b>
                <span className="lo">/ {Math.round(weather.lowF)}°F</span>
              </div>
              <div className="wx-conds">
                {weather.conditions.map((c) => (
                  <span className="cond" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Flights */}
          <article className="icard accent">
            <div className="icard-head">
              <span className="icard-ic">
                <svg className="i i-md" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                </svg>
              </span>
              <h3>Flights</h3>
              <span className="tag">{flights.length} options</span>
            </div>
            <div className="opts">
              {flights.map((f, i) => (
                <div className="opt" key={i}>
                  <div className="opt-title">{f.airline}</div>
                  <div className="opt-sub">{f.route}</div>
                  <div className="opt-note">{f.note}</div>
                  <div className="opt-foot">
                    <div className="opt-price">
                      <b>{usd(f.priceUsd)}</b>
                      <span>per traveller</span>
                    </div>
                    <button className="btn btn-quiet opt-book" type="button">
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Hotels */}
          <article className="icard">
            <div className="icard-head">
              <span className="icard-ic">
                <svg className="i i-md" viewBox="0 0 24 24">
                  <path d="M3 21V6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15" />
                  <path d="M14 10h6a1 1 0 0 1 1 1v10" />
                  <path d="M2 21h20M6.5 9h3M6.5 13h3M6.5 17h3M17 14h1M17 18h1" />
                </svg>
              </span>
              <h3>Hotels</h3>
              <span className="tag">{hotels.length} options</span>
            </div>
            <div className="opts">
              {hotels.map((h, i) => (
                <div className="opt" key={i}>
                  <div className="opt-title">{h.name}</div>
                  <div className="opt-sub">{h.area}</div>
                  <div className="opt-note">{h.note}</div>
                  <div className="opt-foot">
                    <div className="opt-price">
                      <b>{usd(h.pricePerNightUsd)}</b>
                      <span>per night</span>
                    </div>
                    <button className="btn btn-quiet opt-book" type="button">
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Activities */}
          <article className="icard span-2">
            <div className="icard-head">
              <span className="icard-ic">
                <svg className="i i-md" viewBox="0 0 24 24">
                  <path d="M9 11l2.5 2.5L16 9" />
                  <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
                  <path d="M8 2.5v4M16 2.5v4M3.5 9.5h17" />
                </svg>
              </span>
              <h3>Activities</h3>
              <span className="tag">{activities.length} ideas</span>
            </div>
            <ul className="acts">
              {activities.map((a, i) => (
                <li key={i}>
                  <span className="check">
                    <svg className="i" viewBox="0 0 24 24" width="13" height="13">
                      <path d="M5 12l4 4L19 6" />
                    </svg>
                  </span>
                  <div>
                    <div className="act-title">{a.title}</div>
                    <div className="act-detail">{a.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="itin-restart">
          <Link className="btn btn-quiet" href="/">
            <svg className="i i-sm" viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 12a9 9 0 1 0 2.6-6.4M3 4v4h4" />
            </svg>
            Plan another trip
          </Link>
        </div>
      </div>
    </main>
  );
}
