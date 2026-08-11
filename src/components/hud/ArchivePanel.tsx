"use client";

import { useState } from "react";
import Link from "next/link";
import { TechBorder } from "@/components/ui/TechBorder";
import { PanelTitle } from "@/components/ui/PanelTitle";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { education } from "@/content/education";

type Tab = "PROJECTS" | "EXPERIENCE" | "EDUCATION";

const TABS: Tab[] = ["PROJECTS", "EXPERIENCE", "EDUCATION"];

export function ArchivePanel() {
  const [tab, setTab] = useState<Tab>("PROJECTS");

  return (
    <TechBorder as="section" className="flex flex-col min-h-0 flex-1">
      <PanelTitle
        action={
          <span className="font-tech text-[9px] text-[var(--text-dim)]">
            {tab === "PROJECTS"
              ? projects.length
              : tab === "EXPERIENCE"
                ? experience.length
                : education.length}
          </span>
        }
      >
        ARCHIVE
      </PanelTitle>

      {/* ---- tabs ---- */}
      <div
        className="flex shrink-0 border-b border-[var(--border-subtle)]"
        role="tablist"
      >
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t)}
              className={[
                "flex-1 px-2 py-2 font-tech text-[9px] tracking-[0.12em] transition-colors",
                active
                  ? "bg-[var(--bg-tab-active)] text-[var(--text-tab-active)]"
                  : "text-[var(--text-tab-inactive)] hover:text-[var(--text-secondary)]",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* ---- list ---- */}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-thin px-3 py-2">
        {tab === "PROJECTS" &&
          projects.map((p) => (
            <Row
              key={p.slug}
              title={p.name}
              meta={p.stack.slice(0, 3).join(" · ")}
              body={p.tagline}
              href={p.flagship ? `/projects/${p.slug}` : undefined}
              flag={p.flagship ? "LIVE" : undefined}
            />
          ))}

        {tab === "EXPERIENCE" &&
          experience.map((role) => (
            <Row
              key={`${role.company}-${role.role}`}
              title={role.role}
              meta={`${role.company} · ${role.duration}`}
              body={role.points[0]}
            />
          ))}

        {tab === "EDUCATION" &&
          education.map((e) => (
            <Row
              key={`${e.institution}-${e.duration}`}
              title={e.qualification}
              meta={`${e.duration} · ${e.result}`}
              body={e.institution}
            />
          ))}
      </div>
    </TechBorder>
  );
}

/* ------------------------------------------------------------------ */

function Row({
  title,
  meta,
  body,
  href,
  flag,
}: {
  title: string;
  meta: string;
  body: string;
  href?: string;
  flag?: string;
}) {
  const content = (
    <>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] text-[var(--text-heading)] truncate">
          {title}
        </span>
        {flag && (
          <span className="font-tech text-[8px] px-1 py-0.5 shrink-0 border border-[var(--neon-pink)] text-[var(--text-accent)]">
            {flag}
          </span>
        )}
      </div>
      <div className="font-tech text-[9px] text-[var(--text-dim)] mt-0.5 truncate">
        {meta}
      </div>
      <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-snug line-clamp-2">
        {body}
      </p>
    </>
  );

  const className =
    "block py-2.5 border-b border-[var(--border-subtle)] last:border-0 transition-colors";

  return href ? (
    <Link href={href} className={`${className} hover:bg-[var(--bg-surface)]`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
