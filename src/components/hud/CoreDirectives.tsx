"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TechBorder } from "@/components/ui/TechBorder";
import { PanelTitle } from "@/components/ui/PanelTitle";
import { profile } from "@/content/profile";

const DIRECTIVES = profile.availability;

const ROTATE_MS = 5000;

export function CoreDirectives() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((n) => (n + 1) % DIRECTIVES.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <TechBorder as="section" className="flex flex-col shrink-0">
      <PanelTitle icon={<ShieldIcon />}>CORE_DIRECTIVES</PanelTitle>

      <div className="px-3 py-3">
        {/* ---- rotating directive ---- */}
        <div className="min-h-[3.5rem] bg-[var(--bg-surface)] border-l-2 border-[var(--neon-pink)] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="w-1.5 h-1.5 rotate-45 bg-[var(--neon-pink)] shrink-0"
            />
            <span className="font-tech text-[10px] tracking-wider text-[var(--text-heading)]">
              DIRECTIVE {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-1.5 text-[12px] text-[var(--text-muted)] leading-snug">
            {DIRECTIVES[index]}
          </p>
        </div>

        {/* ---- primary action ---- */}
        <Link
          href="/book"
          className="mt-3 flex items-center justify-center gap-2 py-2.5 border border-[var(--neon-pink)] bg-[var(--bg-surface)] font-tech text-[11px] tracking-[0.15em] text-[var(--text-accent)] hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          ▸ BOOK A MEETING
        </Link>

        <div className="mt-3 font-tech text-[10px] text-[var(--text-dim)]">
          @sameerkumar1012
        </div>
      </div>
    </TechBorder>
  );
}

/* ------------------------------------------------------------------ */

function ShieldIcon() {
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
      <path d="M8 1.5l5.5 2v4c0 3-2.3 5.6-5.5 6.5-3.2-.9-5.5-3.5-5.5-6.5v-4l5.5-2z" />
    </svg>
  );
}
