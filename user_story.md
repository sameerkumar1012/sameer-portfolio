# User Stories — Sameer Kumar Portfolio

**Product:** A portfolio site for a backend & AI engineer where the flagship projects are not screenshots but working software the visitor can use on the page.

**Visual direction:** A viewport-locked HUD dashboard modelled on [fri-portfolio](https://github.com/bravohenry/fri-portfolio) ([live](https://friday-portfolio-iota.vercel.app/)) — neon pink `#ec4899` on `#050510`, glass panels with corner brackets, arc reactor, matrix rain, scanlines, live clock.

**Status legend:** ✅ Done and verified · 🟡 Built, needs restyling · ⬜ Not started

---

## 1. Personas

| ID | Persona | Goal | Time on site |
| --- | --- | --- | --- |
| P1 | **Recruiter / hiring manager** | Decide quickly whether Sameer is worth an interview, then book one | 60–90 seconds |
| P2 | **Engineer / tech lead** | Judge whether the AI work is real engineering or a tutorial follow-along | 3–5 minutes |
| P3 | **Sameer (owner)** | Keep content current without redeploying by hand; not get spammed or billed unexpectedly | Ongoing |

---

## 2. Epics

| Epic | Title | Status |
| --- | --- | --- |
| E1 | HUD dashboard interface | ✅ |
| E2 | Sameer.AI — conversational resume | ✅ |
| E3 | Calendar.AI — self-service booking | ✅ |
| E4 | Project case studies | ✅ |
| E5 | Backend services, deployable | ✅ |
| E6 | Cross-cutting: theming, motion, security | ✅ |

---

## E1 — HUD dashboard interface ✅

### US-1.1 — Single-screen interface
> **As** P2, **I want** the whole interface to sit in one screen with no page scrolling, **so that** the site itself demonstrates deliberate interface engineering.

**Acceptance criteria**
- On desktop (≥768px) `/` occupies exactly `100vh` with no vertical page scroll.
- Layout is a 12-column grid split 3 / 6 / 3.
- Any panel whose content overflows scrolls **internally**, with a thin styled scrollbar.
- Below 768px the page scrolls normally and panels stack.

### US-1.2 — Reference-faithful chrome
> **As** P1, **I want** the interface to look like a machine console, **so that** it is memorable among dozens of identical portfolios.

**Acceptance criteria**
- Global `border-radius: 0`, exempting the status dot, arc rings and reactor core.
- Every panel carries 12px / 2px neon corner brackets at all four corners.
- Body shows a 40px background grid at very low opacity.
- A fixed 4px scanline overlay and an 8s sweeping scanner bar are present.
- Panel titles are uppercase mono with underscores (`IDENTITY_MATRIX`, `CORE_DIRECTIVES`).

### US-1.3 — System header
> **As** P1, **I want** an at-a-glance status bar, **so that** I get the headline facts before reading anything.

**Acceptance criteria**
- Left: `SAMEER KUMAR` + `BACKEND & AI ENGINEER` subtitle in tracked mono.
- Centre: pulsing green `● AVAILABLE` (says something useful about Sameer, where the reference's `SYSTEM ONLINE` says nothing), plus gauge readouts (projects, skills) with fill bars.
- Right: theme toggle and a **live IST clock** ticking each second, labelled `IST [BANGALORE]`.

### US-1.4 — Identity matrix
> **As** P1, **I want** the core facts in one panel, **so that** I can qualify the candidate in seconds.

**Acceptance criteria**
- Label/value rows with hairline dividers: Designation, Location, Education, Stack, Status.
- Values sourced from `src/content/profile.ts` — never hardcoded in the component.

### US-1.5 — Archive panel
> **As** P2, **I want** to browse projects, experience and education without leaving the dashboard.

**Acceptance criteria**
- Tab strip: `PROJECTS` / `EXPERIENCE` / `EDUCATION`, with the active tab visually marked.
- List scrolls inside the panel; the panel never grows the page.
- Flagship projects link to their case-study route.

### US-1.6 — Diagnostics panel
> **As** P2, **I want** to see metrics about the system itself.

**Acceptance criteria**
- Two large stat tiles (projects, internships).
- A skill-distribution bar chart derived from `src/content/skills.ts`.
- Key/value rows: `> RAG_INDEX`, `> RETRIEVAL`, `> DEPLOY`, in the status colour.

### US-1.7 — Core directives
> **As** P1, **I want** availability and contact routes visible without scrolling.

**Acceptance criteria**
- Rotating directive cards from `profile.availability`.
- Social icons (GitHub, LinkedIn, email) and a prominent **book a meeting** CTA.

---

## E2 — Sameer.AI, conversational resume ✅

### US-2.1 — Ask instead of read
> **As** P1, **I want** to ask a plain-language question about Sameer, **so that** I don't have to scan a whole page for one fact.

**Acceptance criteria** ✅ *(verified end to end)*
- Question posts to `/api/chat`; answer renders as markdown.
- Answers are grounded strictly in retrieved context.
- Off-corpus questions return exactly `I couldn't find that information in Sameer's portfolio.`
- Suggested starter questions are offered on an empty transcript.
- Slash commands: `/help`, `/skills`, `/projects`, `/book`, `/clear`.

### US-2.2 — Retrieval is visible
> **As** P2, **I want** to see *which* documents were retrieved, **so that** I can tell this is real RAG and not a stuffed prompt.

**Acceptance criteria** ✅
- Each answer lists its source chunks (e.g. `skills.md`, `experience.md`).
- Sources appear only once the answer has fully rendered.

### US-2.3 — The chatbot is the centrepiece ✅
> **As** P2, **I want** the interface to visibly react to the AI working, **so that** the chatbot feels like the system's core rather than a widget.

**Acceptance criteria**
- Shared chat-status context exposes `idle | retrieving | generating`.
- Arc reactor core label transitions `STANDBY → RETRIEVING → GENERATING` with a shimmer sweep.
- Arc rings rotate faster while a request is in flight.
- Diagnostics streams `> RETRIEVED  <source>` rows live.
- The terminal panel can expand to fill the entire centre column.

### US-2.4 — Honest failure
> **As** P1, **I want** the site to explain itself when the AI is slow or down, **so that** I don't read it as broken.

**Acceptance criteria** ✅
- After 4s of waiting, a "backend is waking from sleep" notice appears (free-tier cold start ≈50s).
- Network and backend errors render as readable messages, never a blank panel.
- Blocked prompts return the guard layer's message rather than a generic 500.

### US-2.5 — Adversarial input is handled
> **As** P3, **I want** hostile prompts rejected before they cost me money.

**Acceptance criteria** ✅ *(verified)*
- Prompt-injection attempts → `403`.
- Malicious-code requests → `403`.
- Empty or >500-character questions → `400`.
- Model output is sanitised for secrets before it leaves the server.
- Rendered markdown cannot inject HTML or `javascript:` URLs.

---

## E3 — Calendar.AI, self-service booking ✅

### US-3.1 — Book without email tag
> **As** P1, **I want** to book a slot directly, **so that** scheduling doesn't cost three emails.

**Acceptance criteria** ✅
- Availability comes from live Google Calendar free/busy data.
- Flow is day → time → details (name, email, purpose).
- Success shows date, time, duration and a Google Meet link; an invite is emailed.

### US-3.2 — Only genuinely free slots
> **As** P3, **I want** the site to never offer a slot I can't take.

**Acceptance criteria** ✅ *(verified)*
- Only declared weekday windows (Mon, Wed, Thu, Sat, Sun) appear.
- Slots overlapping a busy period are hidden.
- Past slots and anything inside a 2-hour notice window are hidden.
- Booking is **re-validated server-side** against live availability; a stale tab or crafted request cannot double-book or book out of hours.

### US-3.3 — HUD-styled scheduler ✅
> **As** P1, **I want** the booking page to match the dashboard.

**Acceptance criteria**
- `/book` uses the same panels, brackets and palette.
- Day and time choices read as console selections, not generic form controls.

---

## E4 — Project case studies ✅

### US-4.1 — Depth on the flagship work
> **As** P2, **I want** architecture and design rationale, **so that** I can assess engineering judgement rather than a feature list.

**Acceptance criteria** ✅
- `/projects/sameer-ai` and `/projects/calendar-ai` are statically generated.
- Each shows overview, a request-flow diagram, "what makes it interesting", and skills.
- Each links to its live demo and its GitHub repo.
- Pages scroll normally — the viewport lock applies only to `/`.

### US-4.2 — Breadth without noise
> **As** P1, **I want** the other six projects visible but subordinate.

**Acceptance criteria** ✅ — compact cards, name + one line + stack, no case-study pages.

---

## E5 — Backend services ✅

### US-5.1 — Deployable RAG service ✅
- Boots with **no** database; FAQ cache degrades to the RAG path rather than erroring.
- FAISS artefacts load by absolute path, so any working directory works.
- `POST /chat` returns `{answer, sources}`; `GET /faq/search` retained for the Streamlit UI.
- `GET /healthz` answers without touching AWS or Postgres.
- No credentials in source. `ALLOWED_ORIGINS` and `BACKEND_SHARED_SECRET` are configurable.

### US-5.2 — Deployable scheduler ✅
- **No interactive OAuth in the service.** Credentials load from `GOOGLE_TOKEN_JSON` and refresh headlessly; consent is a one-off local script (`scripts/auth_local.py`).
- Package-relative imports — runs via `uvicorn backend.app:app` from the repo root.
- Missing credentials produce a safe `503`, never leaking paths or env-var names.

### US-5.3 — Backends stay private ✅
- The browser never learns the backend URLs; Next.js route handlers proxy server-side.
- Requests carry `X-Portfolio-Secret`; direct calls without it are rejected.
- **Verified:** direct `401`, proxied `200`, and no secret or backend URL in the client bundle.

### US-5.4 — Corpus is maintainable ✅
- Knowledge base is plain markdown chunked by heading.
- Chunk headings are embedded alongside bodies — without this, `Cloud & Data Warehousing` was unretrievable by "what cloud technologies does he know?".
- Rebuild is one command: `python -m backend.vector_store`.

---

## E6 — Cross-cutting ✅

### US-6.1 — Light and dark ✅
- Toggle switches `data-theme` on `<html>`; choice persists.
- Theme is applied **before first paint** — no flash of the wrong palette.
- Every colour resolves through a CSS custom property; no hardcoded colours in components.
- Light theme is the pink-on-`#fafafa` variant, not a different design.

### US-6.2 — Motion is optional ✅
- Every animation is disabled under `prefers-reduced-motion: reduce`.
- The typewriter reveal renders instantly instead of animating.

### US-6.3 — Content has one source of truth 🟡 (known duplication)
- All site copy lives in `src/content/*.ts`.
- **Known duplication:** the same facts exist in `Sameer.ai/knowledge/*.md` for the RAG corpus. They must be updated together or the chatbot will contradict the page it sits on. *(Open item — see below.)*

### US-6.4 — Clean build
- `npm run build`, `npx tsc --noEmit` and `npm run lint` all clean — **zero errors**.

---

## 3. Technical constraints

- **Vercel cannot host the AI services.** FAISS, boto3, psycopg2 and the Google client libraries need a real Python host (Render/Railway/Fly). Three deployables, not one.
- **Free tiers sleep.** First request after idle takes ~50s; the UI must show a waking state.
- **Bedrock costs money per question.** The FAQ cache and guard layer exist to bound this.
- **The Google refresh token is a full-calendar credential.** Env var only, never committed.
- Port 8000 on this machine is occupied by a Docker container running an older Sameer.ai build — use `:8010` locally.

---

## 4. Open items to discuss

1. **Content duplication (US-6.3).** Site copy and RAG corpus are maintained separately today. Options: leave it and rely on discipline; generate `src/content/*.ts` from the markdown at build time; or have the site fetch the corpus from the RAG service. Worth deciding before the content grows.
2. **Arc reactor core.** The reference uses a `core.mp4` video asset that isn't available. Proposal is a pure CSS/SVG rotating core — no binary asset, same effect. Needs sign-off.
3. **Matrix rain implementation.** Reference uses the `@chenglou/pretext` dependency. Proposal is `shape-outside: circle()` for text flowing around the core — zero JS, no new dependency.
4. **Pixel font.** The reference uses Geist Pixel Square for the clock and counters. If that export is missing from the installed `geist` package, fall back to Geist Mono.
5. **Deployment ownership.** Render services, the Google OAuth consent run and the Vercel import all need Sameer's accounts — these can't be completed from here.
6. **Domain.** `profile.siteUrl` is a placeholder (`sameerkumar.dev`) and drives OpenGraph metadata.
