import type { ElementType, ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/** Frosted container with a hairline accent border. No corner brackets. */
export function GlassPanel({
  children,
  className = "",
  as: Tag = "div",
}: GlassPanelProps) {
  return <Tag className={`glass-panel ${className}`}>{children}</Tag>;
}
