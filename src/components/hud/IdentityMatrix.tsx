import { TechBorder } from "@/components/ui/TechBorder";
import { PanelTitle } from "@/components/ui/PanelTitle";
import { profile } from "@/content/profile";
import { education } from "@/content/education";

const degree = education[0];

const ROWS: { label: string; value: string }[] = [
  { label: "Designation", value: profile.title },
  { label: "Location", value: profile.location },
  { label: "Education", value: `${degree.institution.split(" ")[0]} · ${degree.result}` },
  { label: "Core stack", value: "Python · FastAPI · AWS" },
  { label: "Status", value: "Open to work" },
];

export function IdentityMatrix() {
  return (
    <TechBorder as="section" className="flex flex-col shrink-0">
      <PanelTitle icon={<GlyphIcon />}>IDENTITY_MATRIX</PanelTitle>

      <dl className="px-3 py-1">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 py-2 border-b border-[var(--border-subtle)] last:border-0"
          >
            <dt className="text-[13px] text-[var(--text-secondary)] shrink-0">
              {row.label}
            </dt>
            <dd className="font-tech text-[11px] text-[var(--text-value)] text-right">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </TechBorder>
  );
}

function GlyphIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <rect x="1.5" y="2.5" width="13" height="11" />
      <path d="M1.5 6.5h13M5.5 6.5v7" />
    </svg>
  );
}
