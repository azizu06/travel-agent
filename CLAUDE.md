@AGENTS.md

# Pop-Choice — Codebase Guide for AI Assistants

## Project Overview

Pop-Choice is a **Next.js 16 App Router** application that recommends movies to groups. It collects each person's preferences (favorite movie, era, mood, favorite film person), creates an OpenAI embedding from the combined input, performs a vector similarity search in Supabase, and returns AI-generated explanations for each matched movie. Movie posters are fetched from TMDB.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.6 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS (v4, PostCSS) | ^4 |
| Validation | Zod | ^4.4.3 |
| AI – Embeddings | OpenAI `text-embedding-3-small` | openai ^6.39.1 |
| AI – Completions | OpenAI `gpt-5-nano` via `openai.responses.create` | same |
| Vector DB | Supabase (pgvector RPC) | ^2.106.2 |
| Poster API | TMDB | — |
| Text Splitting | LangChain `RecursiveCharacterTextSplitter` | @langchain/textsplitters ^1.0.1 |
| Rate Limiting | Upstash Ratelimit + Redis | @upstash/ratelimit ^2, @upstash/redis ^1 |
| Scripts | `tsx` | ^4.22.4 |
| Language | TypeScript (strict, ES2017 target) | ^5 |

> **Important:** This project uses Next.js 16 and OpenAI SDK v6. Both have breaking changes from prior versions your training data covers. Read `node_modules/next/dist/docs/` before writing any Next.js code, and use `openai.responses.create` (not `openai.chat.completions.create`) for chat-style completions.

---

## Directory Structure

```
pop-choice/
├── app/
│   ├── layout.tsx        # Root layout — loads Carter One + Roboto Slab fonts
│   ├── page.tsx          # Entry point ("use client") — wizard state machine
│   ├── actions.ts        # Single server action: getMovieRecs
│   └── globals.css       # All CSS — Tailwind v4 + custom design tokens
│
├── components/
│   ├── sessionForm.tsx   # Step 1: group size + available time
│   ├── prefForm.tsx      # Step 2: per-person preferences (looped)
│   └── movie.tsx         # Step 3: display one recommendation at a time
│
├── lib/
│   ├── schemas.ts        # Zod schemas + TypeScript types (source of truth)
│   ├── movieRecs.ts      # Core logic: embed → search → explain → poster
│   ├── openai.ts         # OpenAI client singleton
│   ├── supabase.ts       # Supabase client singleton
│   ├── tmdb.ts           # TMDB poster lookup
│   ├── instructions.ts   # System prompt string for the AI
│   ├── splitter.ts       # LangChain splitter config (used by seed script)
│   └── ratelimit.ts      # Upstash Redis rate limiter singleton (5 req/6 hr per IP)
│
├── scripts/
│   └── seedMovies.ts     # DB seed: parse movies.txt → embed → delete-then-insert (idempotent)
│
├── data/
│   └── movies.txt        # 40+ films with title, year, rating, runtime, synopsis
│
├── public/
│   ├── popcorn.png       # App logo
│   └── poster.png        # Fallback poster when TMDB returns nothing
│
├── next.config.ts        # Enables image.tmdb.org as remote image host
├── postcss.config.mjs    # Tailwind v4 PostCSS plugin
├── tsconfig.json         # Strict TS; path alias @/* → root
├── eslint.config.mjs     # ESLint 9 flat config with Next.js rules
└── package.json
```

---

## Environment Variables

No `.env.example` exists — create `.env.local` with:

```
OPENAI_API_KEY=            # Required for embeddings and chat completions
NEXT_PUBLIC_SUPABASE_URL=  # Supabase project URL (exposed to browser)
SUPABASE_API_KEY=          # Supabase service role key (server-only)
TMDB_TOKEN=                # TMDB bearer token for poster search
UPSTASH_REDIS_REST_URL=    # Upstash Redis REST URL (required for rate limiting)
UPSTASH_REDIS_REST_TOKEN=  # Upstash Redis REST token (required for rate limiting)
```

`NEXT_PUBLIC_SUPABASE_URL` is the only variable safe to expose to the browser. All others must remain server-side only.

---

## Development Workflow

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run seed         # Seed Supabase with movie embeddings (run once or after data changes)
```

The seed script (`scripts/seedMovies.ts`) is a one-time operation that:
1. Reads and parses `data/movies.txt`
2. Chunks descriptions with LangChain (`chunkSize: 500`, `overlap: 75`)
3. Calls OpenAI to embed each chunk
4. Deletes existing rows for each movie title, then inserts fresh rows (idempotent — safe to re-run)

---

## Application Flow

```
page.tsx (client, step="setup")
  └── SessionForm  → collects peopleCount + time
        ↓ handleSetup
page.tsx (step="prefs", loops prefIdx 1..peopleCount)
  └── PrefForm     → collects favMovie, era, mood, favPerson per person
        ↓ handlePrefs (last person triggers server action)
actions.ts (server action)
  └── getMovieRecs → lib/movieRecs.ts::getMovies
        ├── Build preference string from all persons + session
        ├── createEmbedding  (OpenAI text-embedding-3-small)
        ├── findMatches      (Supabase RPC match_popmovies, threshold 0.3, top 5)
        └── For each match:
              ├── getPosterUrl  (TMDB API)
              └── getChatCompletion (gpt-5-nano, openai.responses.create)
page.tsx (step="results")
  └── MoviePage    → displays title, year, poster, AI explanation
        └── nextMovie() advances recIdx; exhausting all recs calls resetAll()
```

---

## Key Files

### `lib/schemas.ts` — Single source of truth for types

```ts
SessionSchema    // peopleCount (number), time (string)
PreferencesSchema // favMovie, era ("new"|"classic"), mood ("fun"|"serious"|"inspiring"|"scary"), favPerson
Movie            // title, releaseYear, posterUrl (nullable), explanation
MovieMatch       // raw Supabase row: id, title, release_year, content, similarity
```

Always import types from here. Do not duplicate type definitions elsewhere.

### `lib/movieRecs.ts` — Core recommendation engine

- `createEmbedding(input)` — returns `number[]` from OpenAI
- `findMatches(embedding)` — calls Supabase RPC `match_popmovies`
- `getChatCompletion(text, query)` — uses `openai.responses.create` with `gpt-5-nano`
- `getMovies(session, prefs)` — orchestrates the full pipeline, returns `Movie[]`

### `app/actions.ts` — Server action boundary

Wraps `getMovies` with IP-based rate limiting (5 requests per 6 hours per IP via Upstash Redis). The rate-limit check is wrapped in a try/catch — if Upstash is unreachable the request is allowed through rather than crashing. IP is read from `x-forwarded-for`, falling back to `x-real-ip`, then `"anonymous"`. Do not add other business logic here; keep it in `lib/movieRecs.ts`.

### `lib/ratelimit.ts` — Upstash Redis rate limiter

Exports a `ratelimit` singleton. Uses a sliding-window limiter: 5 requests per 6 hours per IP. Requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to be configured.

### `app/globals.css` — All styling

Tailwind v4 with custom CSS variables. No `tailwind.config.ts` exists (v4 uses PostCSS). Design tokens:

```css
--background: #000c36  /* dark navy */
--foreground: #ffffff
--control:    #4b5887  /* input/pill background */
--button:     #52e084  /* green CTA */
--ink:        #000c36  /* button text */
```

The `.screen` class constrains width to `min(100vw, 393px)` and min-height to `852px` (iPhone 14 Pro Max portrait). All layout decisions assume this viewport.

---

## Supabase Schema

Table: `pop_choice`

| Column | Type | Notes |
|---|---|---|
| id | integer | PK |
| title | text | Movie title |
| release_year | integer | 4-digit year |
| content | text | Chunked description |
| embedding | vector | pgvector column |

RPC: `match_popmovies(query_embedding, match_threshold, match_count)` — performs cosine similarity search using pgvector.

---

## OpenAI API Usage

This project uses **OpenAI SDK v6**, which differs from v4/v5:

- **Embeddings:** `openai.embeddings.create({ model, input })` — unchanged
- **Completions:** `openai.responses.create({ model, input, instructions })` — this is the v6 `Responses API`, **not** `chat.completions.create`. Do not substitute one for the other.
- Model for completions: `gpt-5-nano`
- Model for embeddings: `text-embedding-3-small`

---

## Styling Conventions

- Tailwind v4 — no config file, utility classes are generated from CSS `@theme` blocks and PostCSS
- All custom styles live in `app/globals.css` — do not create component-level CSS files
- BEM-style class names for semantic elements (`.movie-title`, `.primary-button`, `.start-form`)
- No CSS-in-JS, no CSS Modules
- Fonts: Carter One for headings/brand, Roboto Slab for body — both loaded via `next/font/google` in `layout.tsx`

---

## Code Conventions

- All shared types come from `lib/schemas.ts` (Zod schemas + `z.infer`)
- Path alias `@/` maps to the project root (e.g. `@/lib/schemas`)
- No test framework is configured — do not add test files without first setting one up
- No authentication — the app is entirely public
- Server-only code (API keys, DB calls) lives in `lib/` or `app/actions.ts`; never import server-only modules in client components
- `"use client"` is on `app/page.tsx` — components it imports are also client-side unless they contain no client-only hooks
- Error handling in `getMovies` catches and logs errors, returning `[]` — the UI handles the empty-state gracefully
- No CI/CD is configured

---

## Adding New Movies

1. Append entries to `data/movies.txt` following the existing format (Title, Year, Rating, Runtime, description)
2. Re-run `npm run seed` — it deletes existing rows for those movie titles before inserting, so re-runs are safe
