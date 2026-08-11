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
      className="flex-none h-14 md:h-16 border-b backdrop-blur-md flex items-center justify-between gap-3 px-4 md:px-6 z-30"
      style={{
        borderColor: "var(--border-accent)",
        backgroundColor: "var(--header-bg)",
      }}
    >
      {/* ---- identity ---- */}
      <Link href="/" className="min-w-0 group">
        <h1 className="text-lg md:text-2xl font-thin tracking-[0.12em] truncate text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
          {profile.name}
        </h1>
        <p className="font-tech text-[8px] md:text-[10px] tracking-[0.2em] text-[var(--text-accent-soft)] truncate">
          {profile.title.toUpperCase()} — v1.0
        </p>
      </Link>

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
