"use client";

import { TechBorder } from "@/components/ui/TechBorder";
import { PanelTitle } from "@/components/ui/PanelTitle";
import { StatTile } from "@/components/ui/StatTile";
import { useChatStatus } from "./ChatStatus";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";

const MAX_GROUP = Math.max(...skillGroups.map((g) => g.items.length));

const READOUTS: { key: string; value: string; tone: "status" | "accent" }[] = [
  { key: "RAG_INDEX", value: "26 CHUNKS", tone: "status" },
  { key: "RETRIEVAL", value: "FAISS + FAQ", tone: "status" },
  { key: "EMBEDDINGS", value: "TITAN V2", tone: "accent" },
  { key: "DEPLOY", value: "VERCEL", tone: "accent" },
];

export function Diagnostics() {
  const { sources, phase } = useChatStatus();

  return (
    <TechBorder as="section" className="flex flex-col min-h-0 flex-1">
      <PanelTitle icon={<ChartIcon />}>DIAGNOSTICS</PanelTitle>

      <div className="flex-1 min-h-0 overflow-y-auto scroll-thin px-3 py-3">
        {/* ---- stat tiles ---- */}
        <div className="flex gap-2">
          <StatTile label="PROJECTS" value={projects.length} />
          <StatTile label="INTERNSHIPS" value={experience.length} />
        </div>

        {/* ---- skill distribution ---- */}
        <p className="font-tech text-[9px] tracking-[0.15em] text-[var(--text-accent-soft)] mt-4 mb-2">
          SKILL DISTRIBUTION
        </p>
        <div className="flex items-end gap-1 h-16 bar-track px-1.5 py-1.5">
          {skillGroups.map((group, i) => (
            <div
              key={group.label}
              title={`${group.label}: ${group.items.length}`}
              className="bar-fill bar-animate flex-1"
              style={{
                height: `${(group.items.length / MAX_GROUP) * 100}%`,
                opacity: group.primary ? 1 : 0.45,
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>

        {/* ---- live retrieval ---- */}
        <p className="font-tech text-[9px] tracking-[0.15em] text-[var(--text-accent-soft)] mt-4 mb-2">
          LAST RETRIEVAL
        </p>
        <div className="space-y-1">
          {sources.length === 0 ? (
            <p className="font-tech text-[10px] text-[var(--text-dim)]">
              {phase === "idle"
                ? "> awaiting query"
                : "> searching index…"}
            </p>
          ) : (
            sources.map((s, i) => (
              <div
                key={`${s.source}-${i}`}
                className="flex items-baseline justify-between gap-2 font-tech text-[10px]"
              >
                <span className="text-[var(--text-dim)] shrink-0">
                  &gt; {s.source}
                </span>
                <span className="text-[var(--text-status)] truncate text-right">
                  {s.title}
                </span>
              </div>
            ))
          )}
        </div>

        {/* ---- static readouts ---- */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
          {READOUTS.map((r) => (
            <div
              key={r.key}
              className="flex items-baseline justify-between gap-2 font-tech text-[10px]"
            >
              <span className="text-[var(--text-dim)]">&gt; {r.key}</span>
              <span
                className={
                  r.tone === "status"
                    ? "text-[var(--text-status)]"
                    : "text-[var(--text-accent)]"
                }
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </TechBorder>
  );
}

function ChartIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M2 14V2M2 14h12" />
      <path d="M5 11V8M8.5 11V5M12 11V6.5" />
    </svg>
  );
}
