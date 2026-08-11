import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SlotsLoader } from "@/components/SlotsLoader";
import { TechBorder } from "@/components/ui/TechBorder";

export const metadata: Metadata = {
  title: "Book a meeting",
  description:
    "Pick a slot from Sameer Kumar's live Google Calendar availability. Booking creates a confirmed event with a Google Meet link.",
};

// Availability is live calendar data — never cache this page.
export const dynamic = "force-dynamic";

export default function BookPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="font-tech text-[10px] tracking-wider text-[var(--text-dim)] hover:text-[var(--neon-pink)] transition-colors"
      >
        ← RETURN TO DASHBOARD
      </Link>

      <header className="mt-6 mb-6">
        <p className="font-tech text-[10px] tracking-[0.2em] text-[var(--text-accent)]">
          CALENDAR.AI // SCHEDULER
        </p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-thin tracking-[0.08em] text-[var(--text-primary)]">
          Book a meeting
        </h1>
        <p className="mt-3 text-[14px] text-[var(--text-muted)] leading-relaxed">
          These slots come from my actual Google Calendar, so everything you
          see is genuinely free. Booking creates the event and sends you a Meet
          link straight away.
        </p>
      </header>

      {/* Streams the shell immediately, so a slow scheduler never blocks the
          page — the fallback shows while availability is still being fetched. */}
      <Suspense fallback={<QueryingCalendar />}>
        <SlotsLoader />
      </Suspense>
    </main>
  );
}

function QueryingCalendar() {
  return (
    <TechBorder className="px-6 py-10 text-center">
      <p className="font-tech text-[12px] text-[var(--text-muted)]">
        QUERYING CALENDAR
        <span className="caret ml-1" />
      </p>
      <p className="mt-2 font-tech text-[10px] text-[var(--text-dim)]">
        Reading live free/busy data from Google Calendar.
      </p>
    </TechBorder>
  );
}
