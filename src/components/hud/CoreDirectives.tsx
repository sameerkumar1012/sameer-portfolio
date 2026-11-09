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

        {/* ---- contact rail ---- */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-tech text-[10px] text-[var(--text-dim)]">
            @sameerkumar1012
          </span>
          <div className="flex items-center gap-3">
            <IconLink href={profile.resumeUrl} label="Download resume" download>
              <path d="M8 0a.75.75 0 0 1 .75.75v7.19l2.1-2.1a.75.75 0 1 1 1.06 1.06l-3.38 3.38a.75.75 0 0 1-1.06 0L4.09 6.9a.75.75 0 1 1 1.06-1.06l2.1 2.1V.75A.75.75 0 0 1 8 0zM2 11.5a.75.75 0 0 1 .75.75v1.5c0 .14.11.25.25.25h10a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 13 15.5H3a1.75 1.75 0 0 1-1.75-1.75v-1.5A.75.75 0 0 1 2 11.5z" />
            </IconLink>
            <IconLink href={profile.github} label="GitHub">
              <path d="M8 0C3.6 0 0 3.6 0 8c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.3.6.8.6 1.6v2.2c0 .2.1.5.6.4C13.7 14.5 16 11.5 16 8c0-4.4-3.6-8-8-8z" />
            </IconLink>
            <IconLink href={profile.linkedin} label="LinkedIn">
              <path d="M13.6 0H2.4A2.4 2.4 0 0 0 0 2.4v11.2A2.4 2.4 0 0 0 2.4 16h11.2a2.4 2.4 0 0 0 2.4-2.4V2.4A2.4 2.4 0 0 0 13.6 0zM5 13.5H2.7V6H5v7.5zM3.8 5A1.3 1.3 0 1 1 3.8 2.4 1.3 1.3 0 0 1 3.8 5zm9.7 8.5h-2.3V9.8c0-.9 0-2-1.2-2s-1.4 1-1.4 1.9v3.8H6.3V6h2.2v1h.1c.3-.6 1.1-1.2 2.2-1.2 2.3 0 2.7 1.5 2.7 3.5v4.2z" />
            </IconLink>
            <IconLink href={`mailto:${profile.email}`} label="Email">
              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zm1.7-.2L8 8l6.3-4.7H1.7z" />
            </IconLink>
          </div>
        </div>
      </div>
    </TechBorder>
  );
}

/* ------------------------------------------------------------------ */

function IconLink({
  href,
  label,
  download,
  children,
}: {
  href: string;
  label: string;
  download?: boolean;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      aria-label={label}
      {...(download ? { download: true } : {})}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-[var(--text-dim)] hover:text-[var(--neon-pink)] transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}

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
