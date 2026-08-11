import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TechBorder } from "@/components/ui/TechBorder";
import { getProject, projects } from "@/content/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.filter((p) => p.flagship).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.tagline };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project || !project.flagship) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="font-tech text-[10px] tracking-wider text-[var(--text-dim)] hover:text-[var(--neon-pink)] transition-colors"
      >
        ← RETURN TO DASHBOARD
      </Link>

      <header className="mt-6">
        <p className="font-tech text-[10px] tracking-[0.2em] text-[var(--text-accent)]">
          PROJECT_FILE // {project.year}
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-thin tracking-[0.08em] text-[var(--text-primary)]">
          {project.name}
        </h1>
        <p className="mt-3 text-[15px] text-[var(--text-muted)]">
          {project.tagline}
        </p>

        <div className="mt-6 flex flex-wrap gap-2 font-tech text-[11px]">
          {project.demo && (
            <Link
              href={project.demo.href}
              className="px-4 py-2 border border-[var(--neon-pink)] bg-[var(--bg-surface)] text-[var(--text-accent)] tracking-[0.1em] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              ▸ {project.demo.label.toUpperCase()}
            </Link>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-[var(--border-accent)] text-[var(--text-muted)] tracking-[0.1em] hover:border-[var(--neon-pink)] hover:text-[var(--text-accent)] transition-colors"
            >
              SOURCE ↗
            </a>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      </header>

      <Section title="OVERVIEW">
        <p className="text-[14px] text-[var(--text-muted)] leading-relaxed">
          {project.overview}
        </p>
      </Section>

      {project.architecture && (
        <Section title="REQUEST FLOW">
          <TechBorder className="px-5 py-4">
            <ol>
              {project.architecture.map((step, i) => (
                <li key={step} className="flex gap-3 items-start">
                  <div
                    className="flex flex-col items-center self-stretch"
                    aria-hidden
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rotate-45 bg-[var(--neon-pink)] shrink-0" />
                    {i < project.architecture!.length - 1 && (
                      <span className="w-px flex-1 min-h-5 bg-[var(--border-divider)]" />
                    )}
                  </div>
                  <span className="font-tech text-[12px] text-[var(--text-muted)] pb-3.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </TechBorder>
        </Section>
      )}

      {project.highlights && (
        <Section title="WHAT MAKES IT INTERESTING">
          <div className="space-y-3">
            {project.highlights.map((item) => (
              <TechBorder key={item.title} className="px-5 py-4">
                <h3 className="text-[14px] text-[var(--text-heading)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] text-[var(--text-muted)] leading-relaxed">
                  {item.body}
                </p>
              </TechBorder>
            ))}
          </div>
        </Section>
      )}

      <Section title="SKILLS DEMONSTRATED">
        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <Chip key={skill} accent>
              {skill}
            </Chip>
          ))}
        </div>
      </Section>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-tech text-[10px] tracking-[0.2em] text-[var(--text-panel-title)] mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Chip({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={[
        "inline-block font-tech text-[10px] leading-none px-2 py-1.5 border",
        accent
          ? "border-[var(--neon-pink)] text-[var(--text-accent)] bg-[var(--bg-surface)]"
          : "border-[var(--border-accent)] text-[var(--text-dim)]",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
