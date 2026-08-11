"use client";

import { useState } from "react";
import { TechBorder } from "@/components/ui/TechBorder";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AvailableDay {
  day: string;
  date: string;
  slots: string[];
}

interface SlotPickerProps {
  /** Fetched on the server by SlotsLoader. Null when that fetch failed. */
  initialDays: AvailableDay[] | null;
  initialError: string | null;
}

interface Booking {
  date: string;
  time: string;
  duration: string;
  meet_link?: string;
  calendar_link?: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "ready"; days: AvailableDay[] }
  | { status: "error"; message: string };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SlotPicker({ initialDays, initialError }: SlotPickerProps) {
  // Seeded from the server render, so there is no fetch-on-mount effect and
  // no loading flash — the first paint already has real availability.
  const [load, setLoad] = useState<LoadState>(
    initialDays
      ? { status: "ready", days: initialDays }
      : { status: "error", message: initialError ?? "Could not load availability." },
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", email: "", purpose: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  /* --- refresh availability ------------------------------------------ */

  /**
   * Only ever called from a user action — the retry button, or after a
   * booking conflict. The initial load happens on the server.
   */
  async function refresh() {
    setLoad({ status: "loading" });

    try {
      const response = await fetch("/api/slots");
      const data = await response.json();

      if (!response.ok) {
        setLoad({
          status: "error",
          message: data.error ?? "Could not load availability.",
        });
        return;
      }
      setLoad({ status: "ready", days: data.days ?? [] });
    } catch {
      setLoad({ status: "error", message: "Network error loading slots." });
    }
  }

  /* --- submit -------------------------------------------------------- */

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedDate || !selectedTime || submitting) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time: selectedTime,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error ?? "Booking failed.");
        // Availability may have shifted under us; refresh and drop the choice
        // so the user re-picks from what is actually free.
        setSelectedTime(null);
        refresh();
        return;
      }
      setBooking(data.meeting ?? null);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* --- states -------------------------------------------------------- */

  if (booking) return <Confirmation booking={booking} />;

  if (load.status === "loading") {
    return (
      <TechBorder className="px-6 py-10 text-center">
        <p className="font-tech text-[12px] text-[var(--text-muted)]">
          REFRESHING AVAILABILITY
          <span className="caret ml-1" />
        </p>
      </TechBorder>
    );
  }

  if (load.status === "error") {
    return (
      <TechBorder className="px-6 py-10 text-center">
        <p className="font-tech text-[12px] text-[var(--text-danger)]">
          {load.message}
        </p>
        <button
          type="button"
          onClick={refresh}
          className="mt-4 font-tech text-[11px] px-4 py-2 border border-[var(--border-accent)] text-[var(--text-muted)] hover:border-[var(--neon-pink)] hover:text-[var(--text-accent)] transition-colors"
        >
          ▸ RETRY
        </button>
      </TechBorder>
    );
  }

  if (load.days.length === 0) {
    return (
      <TechBorder className="px-6 py-10 text-center">
        <p className="text-[13px] text-[var(--text-muted)]">
          No free slots in the next two weeks. Email me instead and
          we&apos;ll find a time.
        </p>
      </TechBorder>
    );
  }

  const activeDay = load.days.find((d) => d.date === selectedDate);

  return (
    <div className="space-y-4">
      {/* ---- 01 day ---- */}
      <TechBorder className="px-4 py-4">
        <StepLabel index="01" label="SELECT DAY" />
        <div className="flex gap-2 overflow-x-auto scroll-thin pb-1">
          {load.days.map((day) => {
            const active = day.date === selectedDate;
            return (
              <button
                key={day.date}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedDate(day.date);
                  setSelectedTime(null);
                }}
                className={[
                  "shrink-0 w-[5.5rem] px-2.5 py-2 border text-left transition-colors",
                  active
                    ? "border-[var(--neon-pink)] bg-[var(--bg-surface-hover)]"
                    : "border-[var(--border-accent)] hover:bg-[var(--bg-surface)]",
                ].join(" ")}
              >
                <span className="block font-tech text-[9px] text-[var(--text-dim)]">
                  {day.day.slice(0, 3).toUpperCase()}
                </span>
                <span className="block font-pixel text-base text-[var(--text-value)] mt-0.5">
                  {day.date.slice(5)}
                </span>
                <span className="block font-tech text-[9px] text-[var(--text-accent-soft)] mt-1">
                  {day.slots.length} FREE
                </span>
              </button>
            );
          })}
        </div>
      </TechBorder>

      {/* ---- 02 time ---- */}
      {activeDay && (
        <TechBorder className="px-4 py-4">
          <StepLabel index="02" label="SELECT TIME" />
          <div className="flex flex-wrap gap-2">
            {activeDay.slots.map((slot) => {
              const active = slot === selectedTime;
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedTime(slot)}
                  className={[
                    "font-tech text-[11px] px-3 py-2 border transition-colors",
                    active
                      ? "border-[var(--neon-pink)] bg-[var(--bg-surface-hover)] text-[var(--text-accent)]"
                      : "border-[var(--border-accent)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)]",
                  ].join(" ")}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <p className="mt-3 font-tech text-[9px] text-[var(--text-dim)]">
            60 MINUTES · ASIA/KOLKATA (IST)
          </p>
        </TechBorder>
      )}

      {/* ---- 03 details ---- */}
      {selectedTime && (
        <TechBorder className="px-4 py-4">
          <StepLabel index="03" label="YOUR DETAILS" />
          <form onSubmit={submit} className="space-y-3">
            <Field
              label="NAME"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              autoComplete="name"
            />
            <Field
              label="EMAIL"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              autoComplete="email"
            />
            <Field
              label="WHAT WOULD YOU LIKE TO DISCUSS?"
              value={form.purpose}
              onChange={(v) => setForm({ ...form, purpose: v })}
              multiline
            />

            {formError && (
              <p className="font-tech text-[11px] text-[var(--text-danger)]">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-tech text-[11px] tracking-[0.12em] px-5 py-3 border border-[var(--neon-pink)] bg-[var(--bg-surface)] text-[var(--text-accent)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-50 transition-colors"
            >
              {submitting
                ? "BOOKING…"
                : `▸ CONFIRM ${selectedDate?.slice(5)} @ ${selectedTime}`}
            </button>
          </form>
        </TechBorder>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StepLabel({ index, label }: { index: string; label: string }) {
  return (
    <h2 className="flex items-baseline gap-2 mb-3">
      <span className="font-tech text-[10px] text-[var(--neon-pink)]">
        {index}
      </span>
      <span className="font-tech text-[10px] tracking-[0.15em] text-[var(--text-panel-title)]">
        {label}
      </span>
    </h2>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const shared =
    "w-full mt-1.5 px-3 py-2 border border-[var(--border-accent)] bg-[var(--bg-input)] text-[13px] text-[var(--text-input)] outline-none focus:border-[var(--neon-pink)] transition-colors placeholder:text-[var(--text-input-placeholder)]";

  return (
    <label className="block">
      <span className="font-tech text-[9px] tracking-[0.12em] text-[var(--text-accent-soft)]">
        {label}
      </span>
      {multiline ? (
        <textarea
          required
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          required
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
        />
      )}
    </label>
  );
}

function Confirmation({ booking }: { booking: Booking }) {
  return (
    <TechBorder className="px-6 py-6">
      <p className="font-tech text-[10px] tracking-[0.2em] text-[var(--text-status)]">
        ● CONFIRMED
      </p>
      <h2 className="mt-3 text-xl font-thin tracking-wide text-[var(--text-primary)]">
        You&apos;re on the calendar
      </h2>

      <dl className="mt-5 space-y-2 font-tech text-[12px]">
        <Row label="DATE" value={booking.date} />
        <Row label="TIME" value={booking.time} />
        <Row label="DURATION" value={booking.duration} />
      </dl>

      {booking.meet_link && (
        <a
          href={booking.meet_link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 font-tech text-[11px] tracking-[0.12em] px-4 py-2.5 border border-[var(--neon-pink)] bg-[var(--bg-surface)] text-[var(--text-accent)] hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          ▸ GOOGLE MEET LINK
        </a>
      )}

      <p className="mt-5 text-[13px] text-[var(--text-muted)] leading-relaxed">
        An invite is on its way to your inbox. If you can, send a short note
        beforehand about what you&apos;d like to cover — it helps me prepare.
      </p>
    </TechBorder>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-24 text-[var(--text-dim)]">{label}</dt>
      <dd className="text-[var(--text-value)]">{value}</dd>
    </div>
  );
}
