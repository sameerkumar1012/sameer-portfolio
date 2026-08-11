"use client";

import { useEffect, useState } from "react";
import { MatrixRain } from "./MatrixRain";
import { PHASE_LABEL, useChatStatus } from "./ChatStatus";

interface ArcReactorProps {
  /** Decorative resume text that flows around the core. */
  fragments: string[];
  /** Shown top-right, e.g. index size. */
  readouts: { label: string; value: string }[];
}

export function ArcReactor({ fragments, readouts }: ArcReactorProps) {
  const { phase, answered } = useChatStatus();
  const busy = phase !== "idle";

  return (
    <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden">
      {/* ---- crosshair grid ---- */}
      <div
        aria-hidden
        className="absolute inset-0 border pointer-events-none"
        style={{ borderColor: "var(--border-crosshair)" }}
      >
        <div
          className="absolute top-0 left-1/2 w-px h-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--crosshair-via), transparent)",
          }}
        />
        <div
          className="absolute top-1/2 left-0 w-full h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--crosshair-via), transparent)",
          }}
        />
      </div>

      <MatrixRain fragments={fragments} />

      {/* ---- reactor ---- */}
      <div className="arc-reactor z-10" data-busy={busy}>
        <div className="arc-ring arc-ring-5" />
        <div className="arc-core">
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative asset, no responsive/loader needs */}
          <img
            src="/october-core.webp"
            alt=""
            aria-hidden
            className="arc-core-img"
          />
        </div>

        <div className="absolute inset-x-0 -bottom-1 text-center">
          <span className="font-tech text-[10px] md:text-[11px] tracking-[0.25em] neon-shimmer">
            {PHASE_LABEL[phase]}
          </span>
        </div>
      </div>

      {/* ---- readouts ---- */}
      <div className="absolute top-3 right-3 text-right z-10 space-y-2">
        {readouts.map((r) => (
          <div key={r.label}>
            <div className="font-tech text-[9px] tracking-wider text-[var(--text-accent)]">
              {r.label}
            </div>
            <div className="font-pixel text-sm text-[var(--text-value)]">
              {r.value}
            </div>
          </div>
        ))}
        <div>
          <div className="font-tech text-[9px] tracking-wider text-[var(--text-accent)]">
            Queries answered
          </div>
          <div className="font-pixel text-sm text-[var(--text-value)] tabular-nums">
            {answered}
          </div>
        </div>
      </div>

      {/* ---- uptime ---- */}
      <Uptime />
    </div>
  );
}

/* ------------------------------------------------------------------ */

const SESSION_START = Date.now();

function format(ms: number): string {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60_000) % 60;
  const h = Math.floor(ms / 3_600_000);
  return `${h}h ${m}m ${s}s`;
}

/** Session uptime, ticking. Starts blank so SSR and first render agree. */
function Uptime() {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const tick = () => setElapsed(format(Date.now() - SESSION_START));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute bottom-3 left-3 z-10">
      <div className="font-tech text-[9px] tracking-wider text-[var(--text-accent)]">
        Session uptime
      </div>
      <div className="font-pixel text-sm text-[var(--text-value)] tabular-nums">
        {elapsed || "0h 0m 0s"}
      </div>
    </div>
  );
}
