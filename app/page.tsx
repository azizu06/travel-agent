"use client";
import { useState } from "react";
import TripForm from "@/components/tripForm";
import ThemeToggle from "@/components/themeToggle";

function BrandMark({ accent = "var(--gold)" }: { accent?: string }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
        <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M16 3 C9 11 9 21 16 29 C23 21 23 11 16 3Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 16 H29" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="2.4" fill={accent} />
      </svg>
    </span>
  );
}

export default function Home() {
  const [formPage, setFormPage] = useState(false);

  if (!formPage) {
    return (
      <main aria-label="Meridian — welcome">
        <section className="hero">
          <div className="hero-sky" aria-hidden="true" />
          <div className="hero-sun" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-horizon" aria-hidden="true" />

          <header className="topbar on-sky">
            <span className="brand">
              <BrandMark />
              <span className="brand-name">
                <b>Meri</b>dian
              </span>
            </span>
            <div className="topbar-actions">
              <ThemeToggle />
            </div>
          </header>

          <div className="hero-body wrap">
            <div className="hero-grid">
              <div className="hero-main-col">
                <span className="hero-kicker rise">
                  <span className="dot" /> Concierge-grade trip design
                </span>
                <h1 className="rise d1">
                  Your next journey, <em>composed</em> while you sleep.
                </h1>
              </div>
              <div className="hero-sub-col hero-main-col">
                <p className="hero-sub rise d2">
                  Tell us who&apos;s going, where, and when. Our agent reads live
                  conditions and assembles a complete, shareable itinerary —
                  flights, a place to stay, the weather you&apos;ll meet, and the
                  days worth remembering.
                </p>
                <div
                  className="hero-cta-row rise d3"
                  style={{ marginTop: "var(--s-5)" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => setFormPage(true)}
                  >
                    Let&apos;s begin
                    <svg className="i arr" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                  <span className="hero-note">No account · about 30 seconds</span>
                </div>
              </div>
            </div>
          </div>

          <div className="wrap" style={{ paddingBottom: "var(--s-8)" }}>
            <ul
              className="trust rise d4"
              style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}
            >
              <li className="trust-item">
                <span className="ic">
                  <svg className="i i-sm" viewBox="0 0 24 24">
                    <path d="M8 14a4 4 0 1 1 .6-7.96A5.5 5.5 0 0 1 19 8.5a3.5 3.5 0 0 1-.5 6.98" />
                    <path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2" />
                  </svg>
                </span>
                <div>
                  <b>Real-time weather</b>
                  <span>Forecasts read at planning time</span>
                </div>
              </li>
              <li className="trust-item">
                <span className="ic">
                  <svg className="i i-sm" viewBox="0 0 24 24">
                    <path d="M12 3l2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 14.8 7.3 17.3l.9-5.1L4.5 8.5l5.2-.8z" />
                  </svg>
                </span>
                <div>
                  <b>Tailored activities</b>
                  <span>Matched to your pace &amp; budget</span>
                </div>
              </li>
              <li className="trust-item">
                <span className="ic">
                  <svg className="i i-sm" viewBox="0 0 24 24">
                    <path d="M16 6l-4-3-4 3" />
                    <path d="M12 3v13" />
                    <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
                  </svg>
                </span>
                <div>
                  <b>Shareable page</b>
                  <span>One link your travel party can open</span>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="form-screen screen-in" aria-label="Design your journey">
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => setFormPage(false)}
          style={{ background: "none", border: "none", padding: 0 }}
          aria-label="Back to home"
        >
          <BrandMark accent="var(--accent)" />
          <span className="brand-name">
            <b>Meri</b>dian
          </span>
        </button>
        <div className="topbar-actions">
          <ThemeToggle />
          <button
            type="button"
            className="ghost-link"
            onClick={() => setFormPage(false)}
          >
            <svg className="i i-sm" viewBox="0 0 24 24">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        </div>
      </header>

      <div className="form-head wrap">
        <div className="step-rail">
          <i /> Step 1 of 2 · Trip details
        </div>
        <h2>Design your journey</h2>
        <p>A few essentials and the agent takes it from here.</p>
      </div>

      <TripForm />
    </main>
  );
}
