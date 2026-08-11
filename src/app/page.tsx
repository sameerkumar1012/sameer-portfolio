import { Dashboard } from "@/components/hud/Dashboard";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";

/**
 * Decorative text that flows around the reactor core. Built on the server
 * from real resume content, so the ambient noise is actually about Sameer.
 */
function buildFragments(): string[] {
  const skills = skillGroups.flatMap((g) => g.items);
  const projectNames = projects.map((p) => p.name);
  const stacks = projects.flatMap((p) => p.stack);
  const roles = experience.map((r) => `${r.role} @ ${r.company}`);

  const pool = [...skills, ...projectNames, ...stacks, ...roles];

  // Repeat so the column always has enough text to fill, whatever the height.
  return [...pool, ...pool, ...pool];
}

const GAUGES = [
  {
    label: "PROJECTS",
    value: String(projects.length),
    percent: Math.min(100, projects.length * 12),
  },
  {
    label: "SKILLS",
    value: String(skillGroups.flatMap((g) => g.items).length),
    percent: Math.min(100, skillGroups.flatMap((g) => g.items).length * 2),
  },
];

const READOUTS = [
  { label: "Retrieval", value: "FAISS" },
  { label: "Model", value: "Bedrock" },
];

export default function Home() {
  return (
    <Dashboard
      fragments={buildFragments()}
      gauges={GAUGES}
      readouts={READOUTS}
    />
  );
}
