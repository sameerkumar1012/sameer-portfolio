"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { renderMarkdown } from "@/lib/markdown";
import { useChatStatus, type RetrievedSource } from "@/components/hud/ChatStatus";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Entry =
  | { kind: "system"; text: string }
  | { kind: "user"; text: string }
  | { kind: "answer"; text: string; sources: RetrievedSource[] }
  | { kind: "error"; text: string };

interface TerminalProps {
  /** Shows the expand control. Only passed from the dashboard. */
  onToggleExpand?: () => void;
  expanded?: boolean;
}

/** Fills whatever container it is given — the parent owns the height. */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SUGGESTIONS = [
  "What cloud technologies does Sameer know?",
  "Tell me about the hybrid RAG project",
  "What did he do at Spectents?",
  "How do I schedule an interview?",
];

const HELP_TEXT = [
  "/skills    — skill breakdown",
  "/projects  — project archive",
  "/book      — open the scheduler",
  "/clear     — clear this transcript",
  "",
  "Anything else is answered from the FAISS index over Sameer's resume.",
].join("\n");

const GREETING: Entry[] = [
  {
    kind: "system",
    text: "SAMEER.AI online — hybrid retrieval over Sameer's resume. Type /help for commands.",
  },
];

/** Target duration of the typewriter reveal, regardless of answer length. */
const REVEAL_MS = 850;
const TICK_MS = 16;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Terminal({ onToggleExpand, expanded = false }: TerminalProps) {
  const router = useRouter();
  const { setPhase, reportAnswer } = useChatStatus();

  const [entries, setEntries] = useState<Entry[]>(GREETING);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  /** Characters of the final answer currently revealed; null when not animating. */
  const [revealed, setRevealed] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  /* --- autoscroll --------------------------------------------------- */

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, revealed, pending]);

  /* --- typewriter reveal -------------------------------------------- */

  useEffect(() => {
    if (revealed === null) return;

    const last = entries[entries.length - 1];
    if (!last || last.kind !== "answer") return;

    const total = last.text.length;
    // Finished: stop scheduling. Deliberately no setState here — completion is
    // derived from `revealed >= total` by the renderer instead.
    if (revealed >= total) return;

    const perTick = Math.max(1, Math.ceil(total / (REVEAL_MS / TICK_MS)));
    const timer = setTimeout(
      () => setRevealed((n) => Math.min(total, (n ?? 0) + perTick)),
      TICK_MS,
    );
    return () => clearTimeout(timer);
  }, [revealed, entries]);

  /* --- slash commands ------------------------------------------------ */

  const runCommand = useCallback(
    (raw: string): boolean => {
      if (!raw.startsWith("/")) return false;
      const command = raw.slice(1).toLowerCase().trim();

      const append = (text: string) =>
        setEntries((prev) => [
          ...prev,
          { kind: "user", text: raw },
          { kind: "system", text },
        ]);

      switch (command) {
        case "help":
          append(HELP_TEXT);
          return true;
        case "clear":
          setEntries(GREETING);
          setRevealed(null);
          return true;
        case "skills":
          append("Skill breakdown is in the DIAGNOSTICS panel.");
          return true;
        case "projects":
          append("Project archive is in the left-hand ARCHIVE panel.");
          return true;
        case "book":
          append("Opening the scheduler…");
          router.push("/book");
          return true;
        default:
          append(`Unknown command: ${raw}. Type /help for the list.`);
          return true;
      }
    },
    [router],
  );

  /* --- ask ----------------------------------------------------------- */

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || pending) return;

      setInput("");
      if (runCommand(trimmed)) return;

      setEntries((prev) => [...prev, { kind: "user", text: trimmed }]);
      setPending(true);
      setSlowNotice(false);
      setPhase("retrieving");

      // Free-tier hosts cold-start; say so rather than looking frozen.
      const slowTimer = setTimeout(() => setSlowNotice(true), 4000);
      // The backend doesn't stream, so this is an honest guess at the point
      // retrieval ends and generation begins — enough to drive the visuals.
      const phaseTimer = setTimeout(() => setPhase("generating"), 700);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed }),
        });
        const data = await response.json();

        if (!response.ok) {
          setEntries((prev) => [
            ...prev,
            { kind: "error", text: data.error ?? "Request failed." },
          ]);
          return;
        }

        const answer: string = data.answer || "(empty response)";
        const sources: RetrievedSource[] = data.sources ?? [];

        setEntries((prev) => [
          ...prev,
          { kind: "answer", text: answer, sources },
        ]);
        reportAnswer(sources);

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        setRevealed(reduceMotion ? answer.length : 0);
      } catch {
        setEntries((prev) => [
          ...prev,
          { kind: "error", text: "Network error. Check your connection." },
        ]);
      } finally {
        clearTimeout(slowTimer);
        clearTimeout(phaseTimer);
        setPending(false);
        setSlowNotice(false);
        setPhase("idle");
      }
    },
    [pending, runCommand, setPhase, reportAnswer],
  );

  /* --- render -------------------------------------------------------- */

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ---- title bar ---- */}
      <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-[var(--border-subtle)] shrink-0">
        <h2 className="font-tech text-[11px] tracking-[0.18em] neon-shimmer">
          SAMEER.AI // HYBRID RAG
        </h2>

        <div className="flex items-center gap-3">
          <span className="font-tech text-[9px] text-[var(--text-dim)] hidden sm:inline">
            {pending ? "BUSY" : "READY"}
          </span>
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={expanded ? "Collapse terminal" : "Expand terminal"}
              className="font-tech text-[10px] px-1.5 text-[var(--text-accent-soft)] hover:text-[var(--neon-pink)] transition-colors"
            >
              {expanded ? "▼ COLLAPSE" : "▲ EXPAND"}
            </button>
          )}
        </div>
      </div>

      {/* ---- transcript ---- */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto scroll-thin px-3 py-3 font-tech text-[12.5px] leading-relaxed"
        aria-live="polite"
      >
        {entries.map((entry, i) => (
          <EntryView
            key={i}
            entry={entry}
            revealChars={
              i === entries.length - 1 && revealed !== null ? revealed : null
            }
          />
        ))}

        {pending && (
          <p className="mt-3 text-[var(--text-dim)]">
            <span className="text-[var(--neon-pink)]">retrieving</span>
            <span className="caret ml-1" />
            {slowNotice && (
              <span className="block mt-1 text-[10px] text-[var(--text-warn)]">
                Backend waking from sleep — the first request can take up to a
                minute.
              </span>
            )}
          </p>
        )}

        {entries.length === 1 && (
          <div className="mt-5">
            <p className="text-[10px] tracking-wider text-[var(--text-dim)] mb-2">
              TRY ASKING
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="text-left text-[11px] px-2 py-1.5 border border-[var(--border-accent)] text-[var(--text-muted)] hover:border-[var(--neon-pink)] hover:text-[var(--text-accent)] hover:bg-[var(--bg-surface)] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---- command input ---- */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="shrink-0 px-3 pb-3"
      >
        <fieldset className="border border-[var(--border-accent)] px-3 pb-2.5 pt-1 bg-[var(--bg-input)]">
          <legend className="font-tech text-[9px] tracking-[0.2em] px-1 text-[var(--text-accent-soft)]">
            COMMAND INPUT
          </legend>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="font-tech text-[12px] text-[var(--terminal-prompt)] shrink-0"
            >
              sameer&gt;
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={pending}
              maxLength={500}
              placeholder="type /help or ask about my work"
              aria-label="Ask Sameer.AI a question"
              className="flex-1 min-w-0 bg-transparent font-tech text-[12.5px] text-[var(--text-input)] outline-none placeholder:text-[var(--text-input-placeholder)] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send"
              className="font-tech text-sm text-[var(--text-accent-soft)] enabled:hover:text-[var(--neon-pink)] transition-colors disabled:opacity-30 shrink-0"
            >
              →
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Transcript entry                                                   */
/* ------------------------------------------------------------------ */

function EntryView({
  entry,
  revealChars,
}: {
  entry: Entry;
  revealChars: number | null;
}) {
  if (entry.kind === "user") {
    return (
      <p className="mt-3 first:mt-0 break-words">
        <span className="text-[var(--terminal-user)]">sameer@ai:~$ </span>
        <span className="text-[var(--text-primary)]">{entry.text}</span>
      </p>
    );
  }

  if (entry.kind === "system") {
    return (
      <p className="mt-3 first:mt-0 whitespace-pre-wrap break-words text-[var(--terminal-meta)]">
        {entry.text}
      </p>
    );
  }

  if (entry.kind === "error") {
    return (
      <p className="mt-3 first:mt-0 break-words text-[var(--text-danger)]">
        {entry.text}
      </p>
    );
  }

  // Re-parse the partial string each tick so lists and headings form as they
  // arrive, rather than the whole block appearing at once.
  const done = revealChars === null || revealChars >= entry.text.length;
  const visible = done ? entry.text : entry.text.slice(0, revealChars);

  return (
    <div className="mt-3 first:mt-0">
      <p className="text-[var(--terminal-prompt)]">oct&gt;</p>
      <div
        className="md mt-1 break-words text-[var(--terminal-output)]"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(visible) }}
      />
      {done && entry.sources.length > 0 && (
        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-[var(--text-dim)]">
          <span>RETRIEVED</span>
          {entry.sources.map((s, i) => (
            <span
              key={`${s.source}-${i}`}
              title={s.title}
              className="px-1.5 py-0.5 border border-[var(--border-subtle)] text-[var(--text-accent-soft)]"
            >
              {s.source}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
