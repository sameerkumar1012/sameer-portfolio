/**
 * Source of truth for identity + contact details shown across the site.
 *
 * NOTE: these facts are duplicated in the Sameer.ai RAG knowledge base
 * (`knowledge/profile.md`). If you change one, change the other — otherwise
 * the chatbot will contradict the page it is embedded in.
 */

export const profile = {
  name: "Sameer Kumar",
  title: "Backend & AI Engineer",
  siteUrl: "https://sameerkumar.dev",
  location: "Bangalore, India",
  email: "sameerkumar1012@gmail.com",
  phone: "+91 6204207664",
  github: "https://github.com/sameerkumar1012",
  linkedin: "https://www.linkedin.com/in/sameer-kumar1012/",

  summary:
    "Backend & AI engineer building production-ready RAG systems, data pipelines and scalable services with Python, FastAPI and AWS.",

  intro:
    "I build production-ready AI applications — retrieval-augmented generation systems, data engineering pipelines and scalable backend services. Most of my work lives at the point where an LLM meets real infrastructure: retrieval that has to be fast, prompts that have to be safe, and pipelines that have to keep running.",

  availability: [
    "Recent engineering graduate",
    "Open to full-time opportunities",
    "Based in Bangalore, India",
    "Available for remote, hybrid and onsite roles",
  ],
} as const;
