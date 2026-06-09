@AGENTS.md

# AI Travel Agent — Guide for AI Assistants

## Project Overview

AI Travel Agent is a **Next.js 16 App Router** app. A user enters a **location**
and **start/end dates**, and an AI agent assembles a **shareable trip page**:
LLM-fabricated flight and hotel options, **real** weather from Open-Meteo,
weather-aware activity ideas, and an AI-generated destination image.

The defining piece is a **hand-written OpenAI tool-calling agent loop** (planned
to be refactored to the Vercel AI SDK later). **Zod** is the source of truth for
types. **There is no database** — not Supabase, Postgres, a vector store, or
Redis. The shareable page is stateless.

> Repurposed from a previous template. The reused scaffold is the build config,
> the OpenAI client singleton (`lib/openai.ts`), and the Tailwind v4 / TypeScript
> setup. Everything else was removed.

> **Important:** Next.js 16 and OpenAI SDK v6 both have breaking changes from
> versions your training data likely covers. Read `node_modules/next/dist/docs/`
> before writing Next.js code. Use `openai.responses.create` (not
> `chat.completions.create`) for chat-style completions.

## This is a solo learning build

The repo is a near-empty starting point: an OpenAI client, the Next.js/Tailwind/TS
scaffold, and a placeholder home page that boots. **Everything else is unbuilt by
design** — the file/folder structure, schemas, the form, the weather integration,
the tools, and the agent loop are all the owner's to design and write.

**Do not scaffold the architecture or implement the app unless explicitly asked.**
That includes inventing the file layout, stubbing modules, or pre-writing TODO
checklists — deciding what files exist and how they connect is the point of the
exercise. When asked for help, prefer guidance over code, and ask before adding
structure.

## Conventions (when you do write code)

- **Zod** is the source of truth for types (`z.infer`). Don't duplicate type defs.
- Path alias `@/` maps to the project root.
- Server-only code (API keys, OpenAI calls) stays server-side; never import it
  into client components.
- Tailwind v4 — no `tailwind.config.ts`. Configure tokens via `@theme` in
  `app/globals.css`. No CSS-in-JS, no CSS Modules.
- No test framework configured; no auth (the app is public).
- **No database** — the shareable trip page must work without persistence
  (e.g. encode the trip in the URL, or regenerate from route params).

## Environment

`.env.local` (see `.env.example`): `OPENAI_API_KEY` (required, server-only).
Weather is from Open-Meteo, which needs no key. No DB/Redis vars.
