interface StatTileProps {
  label: string;
  value: string | number;
}

/** Large numeric readout used in the diagnostics panel. */
export function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="flex-1 px-3 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
      <div className="font-tech text-[9px] tracking-[0.15em] text-[var(--text-accent-soft)] leading-tight">
        {label}
      </div>
      <div className="mt-2 font-pixel text-3xl text-[var(--text-value)] tabular-nums">
        {value}
      </div>
    </div>
  );
}
