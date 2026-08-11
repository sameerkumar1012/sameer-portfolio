import type { ReactNode } from "react";

interface PanelTitleProps {
  /** Uppercase, underscore-separated, e.g. "IDENTITY_MATRIX". */
  children: ReactNode;
  icon?: ReactNode;
  /** Rendered at the right edge — tabs, counts, controls. */
  action?: ReactNode;
}

export function PanelTitle({ children, icon, action }: PanelTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-[var(--border-subtle)] shrink-0">
      <h2 className="flex items-center gap-2 font-tech text-[11px] tracking-[0.18em] text-[var(--text-panel-title)]">
        {icon}
        {children}
      </h2>
      {action}
    </div>
  );
}
