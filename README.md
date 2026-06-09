# AI Travel Agent

Enter a **location** and **start/end dates**, and the app builds a **shareable
trip page**: AI-generated flight and hotel options, real weather for those
dates, weather-aware activity ideas, and an AI-generated destination image.

A learning project, built solo from a bare scaffold.

## Goal & Features

- ✈️ **Flight options** — LLM-generated/fabricated (no real flight data)
- 🏨 **Hotel options** — LLM-generated/fabricated
- 🌤️ **Real weather** for the trip dates — from [Open-Meteo](https://open-meteo.com/) (no API key)
- 📋 **Activity ideas** — LLM-generated, ideally weather-aware
- 🖼️ **AI-generated destination images** — OpenAI image generation
- 🔗 **Shareable trip page**

## Constraints

- **No database.** No Supabase, Postgres, vector store, or Redis. The shareable
  page is stateless.
- The agent uses **OpenAI tool calling**, hand-written first (to be refactored
  to the Vercel AI SDK later).
- **Zod** for schemas/validation.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 (PostCSS, no config file) ·
Zod · OpenAI SDK v6 (`openai.responses.create`, tool calling, images) · Open-Meteo ·
TypeScript (strict).

> Next.js 16 and OpenAI SDK v6 have breaking changes from older versions. Read
> `node_modules/next/dist/docs/` before writing Next.js code.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Create `.env.local` (see `.env.example`):

```
OPENAI_API_KEY=    # required; server-only. Open-Meteo needs no key.
```

## Scaffold

This is a near-empty starting point. What's wired up:

- `lib/openai.ts` — OpenAI client singleton
- `app/` — root layout + a placeholder home page
- Tailwind v4, TypeScript, and ESLint config

Everything else — the form, schemas, weather integration, tools, and the agent
loop — is unbuilt by design.
