"use client";

import { useState } from "react";
import { ChatStatusProvider } from "./ChatStatus";
import { SystemHeader } from "./SystemHeader";
import { IdentityMatrix } from "./IdentityMatrix";
import { ArchivePanel } from "./ArchivePanel";
import { ArcReactor } from "./ArcReactor";
import { Diagnostics } from "./Diagnostics";
import { CoreDirectives } from "./CoreDirectives";
import { Terminal } from "@/components/Terminal";
import { TechBorder } from "@/components/ui/TechBorder";

interface DashboardProps {
  fragments: string[];
  gauges: { label: string; value: string; percent: number }[];
  readouts: { label: string; value: string }[];
}

/**
 * The viewport lock lives here rather than in layout.tsx, so detail routes
 * like /book and /projects/[slug] can still scroll normally.
 */
export function Dashboard({ fragments, gauges, readouts }: DashboardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ChatStatusProvider>
      <div className="flex flex-col w-full h-auto md:h-dvh md:overflow-hidden">
        <SystemHeader gauges={gauges} />

        <main className="flex-1 min-h-0 p-3 md:p-4 md:overflow-hidden">
          <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            {/* ---- left column ---- */}
            <div className="md:col-span-3 flex flex-col gap-3 md:gap-4 min-h-0 order-2 md:order-1">
              <IdentityMatrix />
              <ArchivePanel />
            </div>

            {/* ---- centre column ---- */}
            <div className="md:col-span-6 flex flex-col gap-3 md:gap-4 min-h-0 order-1 md:order-2">
              {/* Hidden while the terminal is expanded so it can take the column */}
              {!expanded && (
                <div className="hidden md:flex flex-col min-h-0 flex-1">
                  <ArcReactor fragments={fragments} readouts={readouts} />
                </div>
              )}

              <TechBorder
                className={[
                  "flex flex-col min-h-0",
                  expanded ? "flex-1" : "h-[26rem] md:h-auto md:flex-[0_0_58%]",
                ].join(" ")}
              >
                <Terminal
                  expanded={expanded}
                  onToggleExpand={() => setExpanded((v) => !v)}
                />
              </TechBorder>
            </div>

            {/* ---- right column ---- */}
            <div className="md:col-span-3 flex flex-col gap-3 md:gap-4 min-h-0 order-3">
              <Diagnostics />
              <CoreDirectives />
            </div>
          </div>
        </main>
      </div>
    </ChatStatusProvider>
  );
}
