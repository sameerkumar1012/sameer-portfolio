# Sameer Kumar — Portfolio

Portfolio site for a backend & AI engineer, where the two flagship projects
are not screenshots but working software you can use on the page.

- **Sameer.AI** (`/chat`) — hybrid-RAG chatbot answering questions about my
  resume, with retrieved sources shown alongside each answer.
- **Calendar.AI** (`/book`) — meeting scheduler reading live Google Calendar
  availability and creating a confirmed event with a Meet link.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · deployed on Vercel.

---

## Architecture

The site is a thin, fast frontend. The AI work lives in two Python services
that are deployed separately and reached only through Next.js route handlers:

```
Browser ──► Next.js (Vercel) ──► /api/chat  ──► Sameer.ai        ──► Bedrock + FAISS + Postgres
                                 /api/slots ──► Meeting_Sheduler ──► Google Calendar
                                 /api/book  ──┘
```

Proxying rather than calling the backends from the browser means the backend
URLs and the shared secret never reach the client, and there is no CORS
preflight on the hot path.

| Repo | Role |
| --- | --- |
| this repo | Site, UI, API proxies |
| [Sameer.ai](https://github.com/sameerkumar1012/Sameer.ai) | RAG service (FastAPI, FAISS, AWS Bedrock) |
| [Meeting_Sheduler](https://github.com/sameerkumar1012/Meeting_Sheduler) | Scheduling service (FastAPI, Google Calendar) |

## Interface

The homepage is a **viewport-locked HUD dashboard**, not a scrolling page: a
3/6/3 grid of glass panels with neon corner brackets that fits one screen and
never scrolls. Panels that overflow scroll internally. Below 768px the grid
stacks and the page scrolls, with the terminal ordered first.

```
┌ SystemHeader — identity · status · gauges · live IST clock ──┐
├──────────────┬──────────────────────────────┬────────────────┤
│ IDENTITY_    │      ARC REACTOR             │ DIAGNOSTICS    │
│ MATRIX       │  rings + resume text rain    │ stat tiles,    │
├──────────────┤  core status ← chat state    │ skill bars,    │
│ ARCHIVE      ├──────────────────────────────┤ live retrieval │
│ projects /   │  SAMEER.AI // HYBRID RAG     ├────────────────┤
│ experience / │  terminal, expands to fill   │ CORE_DIRECTIVES│
│ education    │  the column                  │ + book CTA     │
└──────────────┴──────────────────────────────┴────────────────┘
```

### The centrepiece reacts to the chatbot

`components/hud/ChatStatus.tsx` is a small context holding
`idle | retrieving | generating` plus the last retrieved sources. The terminal
publishes; the arc reactor and diagnostics panel consume. So when you ask a
question the core label steps `STANDBY → RETRIEVING → GENERATING`, the rings
spin up, and the retrieved chunks stream into the diagnostics panel.

That is deliberate: retrieval is the interesting part of this project, and
this makes it something you watch rather than something the copy claims.

## Layout

```
src/
  app/
    page.tsx              Builds HUD data, renders Dashboard
    chat/                 Standalone full-height terminal
    book/                 Scheduler (server-rendered slots + Suspense)
    projects/[slug]/      Case studies (SSG) for the two flagship projects
    api/{chat,slots,book} Proxies to the Python services
  components/
    hud/                  Dashboard, SystemHeader, IdentityMatrix,
                          ArchivePanel, ArcReactor, MatrixRain,
                          Diagnostics, CoreDirectives, ChatStatus
    Terminal.tsx          Chat UI: typewriter reveal, slash commands, sources
    SlotPicker.tsx        Day → time → details booking flow
    SlotsLoader.tsx       Server component — fetches availability directly
    ui/                   GlassPanel, TechBorder, PanelTitle, StatTile,
                          ThemeToggle
  content/                Typed site copy — the single source of truth
  lib/
    backend.ts            Server-only backend client (timeouts, errors, auth)
    markdown.ts           Hardened markdown rendering for model output
```

`/book` fetches availability on the **server** via `SlotsLoader`, so the page
arrives with real slots and no loading flash; the browser only calls
`/api/slots` afterwards, for retry and post-conflict refresh.

### Content

All copy lives in `src/content/*.ts`. These facts are **duplicated** in the
RAG knowledge base at `Sameer.ai/knowledge/*.md` — when you change one, change
the other, or the chatbot will contradict the page it is embedded in.

### Theming

Neon pink `#ec4899` on `#050510`, with a light variant that keeps the same
interface in pink-on-near-white. Every colour resolves through a CSS custom
property in `globals.css`, with `data-theme` on `<html>` selecting the
palette — so the light theme is one block of overrides, not a second design.
**Never hardcode a colour in a component.**

An inline script in `layout.tsx` applies the stored theme before first paint,
so there is no flash of the wrong palette. `ThemeToggle` holds no React state:
it reads `data-theme` off the element on click, and the icons are swapped in
CSS. That avoids both a cascading render and a hydration mismatch.

A global `border-radius: 0` rule (exempting the status dot and reactor rings)
does more for the console aesthetic than any per-component styling.

### Motion

The interface leans hard on animation, so `prefers-reduced-motion: reduce`
is handled comprehensively: all animation and transition durations collapse,
the sweeping scanner bar is hidden, the shimmer falls back to a flat colour,
and the terminal renders answers instantly instead of typing them out.

## Local development

Requires the two Python services running locally.

```bash
npm install
cp .env.example .env.local   # then edit
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `RAG_API_URL` | Base URL of the Sameer.ai service |
| `SCHEDULER_API_URL` | Base URL of the Meeting_Sheduler service |
| `BACKEND_SHARED_SECRET` | Sent as `X-Portfolio-Secret`; must match both services. Leave blank to disable |

The site degrades honestly without the backends: the chat and booking panels
show an error state, everything else renders.

## Deployment

### 1. The RAG service

Host it anywhere that runs Python (Render, Railway, Fly). FAISS, boto3 and
psycopg2 rule out Vercel.

- Start command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
- Env: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
  `BACKEND_SHARED_SECRET`, optionally `DATABASE_URL`
- `DATABASE_URL` is optional — without it the FAQ cache is skipped and every
  question goes to RAG. Slower and pricier, but it stays up.
- Rebuild the index after editing `knowledge/`: `python -m backend.vector_store`

### 2. The scheduling service

- Generate a refresh token **once, locally**: `python -m scripts.auth_local`
- Paste the printed JSON into `GOOGLE_TOKEN_JSON` on the host. The deployed
  service must never run the interactive OAuth flow — it would block forever
  on a machine with no browser.
- Start command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
- Env: `GOOGLE_TOKEN_JSON`, `BACKEND_SHARED_SECRET`, optionally `OWNER_NAME`,
  `OWNER_EMAIL`, `TIMEZONE`

### 3. This site

Import into Vercel and set `RAG_API_URL`, `SCHEDULER_API_URL` and
`BACKEND_SHARED_SECRET`.

> On free hosting tiers the Python services sleep when idle, and the first
> request can take ~50s. Both the terminal and the slot picker detect this and
> show a "waking up" notice rather than appearing broken.

---

Terminal UI and glass-panel patterns adapted from
[bravohenry/fri-portfolio](https://github.com/bravohenry/fri-portfolio) (MIT).
