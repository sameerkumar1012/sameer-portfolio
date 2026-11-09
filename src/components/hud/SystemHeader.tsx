"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { profile } from "@/content/profile";

interface Gauge {
  label: string;
  value: string;
  /** 0–100, drives the fill bar. */
  percent: number;
}

const clockFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function SystemHeader({ gauges }: { gauges: Gauge[] }) {
  const [clock, setClock] = useState("");

  // Starts blank so the server-rendered markup and first client render agree.
  useEffect(() => {
    const tick = () => setClock(clockFmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="flex-none h-16 md:h-20 border-b backdrop-blur-md flex items-center justify-between gap-3 px-4 md:px-6 z-30"
      style={{
        borderColor: "var(--border-accent)",
        backgroundColor: "var(--header-bg)",
      }}
    >
      {/* ---- identity ---- */}
      <div className="min-w-0">
        <Link href="/" className="group block">
          <h1 className="text-lg md:text-2xl font-thin tracking-[0.12em] truncate text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
            {profile.name}
          </h1>
          <p className="font-tech text-[8px] md:text-[10px] tracking-[0.2em] text-[var(--text-accent-soft)] truncate">
            {profile.title.toUpperCase()} — v1.0
          </p>
        </Link>

        <div className="flex items-center gap-3 md:gap-4 mt-1">
          <ContactLink
            href={profile.resumeUrl}
            label="Resume"
            download
            icon={
              <path d="M8 0a.75.75 0 0 1 .75.75v7.19l2.1-2.1a.75.75 0 1 1 1.06 1.06l-3.38 3.38a.75.75 0 0 1-1.06 0L4.09 6.9a.75.75 0 1 1 1.06-1.06l2.1 2.1V.75A.75.75 0 0 1 8 0zM2 11.5a.75.75 0 0 1 .75.75v1.5c0 .14.11.25.25.25h10a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 13 15.5H3a1.75 1.75 0 0 1-1.75-1.75v-1.5A.75.75 0 0 1 2 11.5z" />
            }
          />
          <ContactLink
            href={profile.github}
            label="GitHub"
            icon={
              <path d="M8 0C3.6 0 0 3.6 0 8c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.3.6.8.6 1.6v2.2c0 .2.1.5.6.4C13.7 14.5 16 11.5 16 8c0-4.4-3.6-8-8-8z" />
            }
          />
          <ContactLink
            href={profile.linkedin}
            label="LinkedIn"
            icon={
              <path d="M13.6 0H2.4A2.4 2.4 0 0 0 0 2.4v11.2A2.4 2.4 0 0 0 2.4 16h11.2a2.4 2.4 0 0 0 2.4-2.4V2.4A2.4 2.4 0 0 0 13.6 0zM5 13.5H2.7V6H5v7.5zM3.8 5A1.3 1.3 0 1 1 3.8 2.4 1.3 1.3 0 0 1 3.8 5zm9.7 8.5h-2.3V9.8c0-.9 0-2-1.2-2s-1.4 1-1.4 1.9v3.8H6.3V6h2.2v1h.1c.3-.6 1.1-1.2 2.2-1.2 2.3 0 2.7 1.5 2.7 3.5v4.2z" />
            }
          />
          <ContactLink
            href={`mailto:${profile.email}`}
            label="Email"
            icon={
              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zm1.7-.2L8 8l6.3-4.7H1.7z" />
            }
          />
        </div>
      </div>

      {/* ---- status / gauges / clock ---- */}
      <div className="flex items-center gap-3 md:gap-8 font-tech text-[10px] md:text-xs shrink-0 text-[var(--text-accent-soft)]">
        <div className="flex items-center gap-2">
          <span
            className="status-dot pulse-dot w-2 h-2 shrink-0"
            style={{ background: "var(--text-status)" }}
            aria-hidden
          />
          <span className="hidden sm:inline">AVAILABLE</span>
        </div>

        {gauges.map((g) => (
          <div key={g.label} className="hidden lg:flex flex-col items-end">
            <span>
              {g.label}: {g.value}
            </span>
            <div
              className="w-20 h-1 mt-1"
              style={{ background: "var(--gauge-track)" }}
            >
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${g.percent}%`,
                  background: "var(--gauge-fill)",
                }}
              />
            </div>
          </div>
        ))}

        <ThemeToggle />

        <div className="text-right">
          <div className="font-pixel text-sm md:text-lg text-[var(--text-primary)] tabular-nums">
            {clock || "--:--:--"}
          </div>
          <div className="text-[8px] md:text-[9px] opacity-60">
            IST [BANGALORE]
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */

function ContactLink({
  href,
  label,
  download,
  icon,
}: {
  href: string;
  label: string;
  download?: boolean;
  icon: React.ReactNode;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      {...(download ? { download: true } : {})}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex items-center gap-1 font-tech text-[9px] md:text-[10px] tracking-wider text-[var(--text-secondary)] hover:text-[var(--neon-pink)] transition-colors"
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        {icon}
      </svg>
      <span>{label}</span>
    </a>
  );
}
