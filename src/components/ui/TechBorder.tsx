import type { ElementType, ReactNode } from "react";

interface TechBorderProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/**
 * Glass panel with neon corner brackets on all four corners.
 *
 * The top two brackets come from `::before`/`::after` in globals.css; the
 * bottom two need real elements, since a single element only has two
 * pseudo-elements to spend.
 */
export function TechBorder({
  children,
  className = "",
  as: Tag = "div",
}: TechBorderProps) {
  return (
    <Tag className={`glass-panel tech-border ${className}`}>
      <span className="corner-bl" aria-hidden />
      <span className="corner-br" aria-hidden />
      {children}
    </Tag>
  );
}
