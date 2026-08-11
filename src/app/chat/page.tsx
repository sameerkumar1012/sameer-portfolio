import type { Metadata } from "next";
import Link from "next/link";
import { Terminal } from "@/components/Terminal";
import { TechBorder } from "@/components/ui/TechBorder";
import { ChatStatusProvider } from "@/components/hud/ChatStatus";

export const metadata: Metadata = {
  title: "Sameer.AI",
  description:
    "A hybrid-RAG chatbot answering questions about Sameer Kumar's skills, projects and experience, grounded in his resume.",
};

export default function ChatPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 flex flex-col h-dvh">
      <Link
        href="/"
        className="font-tech text-[10px] tracking-wider text-[var(--text-dim)] hover:text-[var(--neon-pink)] transition-colors shrink-0"
      >
        ← RETURN TO DASHBOARD
      </Link>

      <p className="mt-4 mb-3 shrink-0 text-[13px] text-[var(--text-muted)] leading-relaxed max-w-2xl">
        Questions hit a FAQ cache first, then a FAISS index over my resume.
        Answers are generated only from what was retrieved — if the index
        doesn&apos;t cover it, it says so rather than guessing.
      </p>

      <ChatStatusProvider>
        <TechBorder className="flex flex-col flex-1 min-h-0 mb-2">
          <Terminal />
        </TechBorder>
      </ChatStatusProvider>
    </main>
  );
}
