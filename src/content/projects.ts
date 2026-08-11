/**
 * Mirrors `knowledge/projects.md` in the Sameer.ai RAG corpus. Keep in sync.
 *
 * `flagship` projects get a full case-study page at /projects/[slug] and are
 * the two that run live on this site.
 */

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  flagship: boolean;
  year: string;
  stack: string[];
  repo?: string;
  /** Internal route where the project can actually be used. */
  demo?: { href: string; label: string };
  overview: string;
  /** Rendered as a vertical architecture flow on the case-study page. */
  architecture?: string[];
  highlights?: { title: string; body: string }[];
  skills: string[];
}

export const projects: Project[] = [
  {
    slug: "sameer-ai",
    name: "Sameer.AI",
    tagline: "A hybrid-RAG portfolio chatbot with a real security layer",
    flagship: true,
    year: "2026",
    stack: [
      "FastAPI",
      "FAISS",
      "PostgreSQL",
      "AWS Bedrock",
      "Titan Embeddings",
      "Docker",
    ],
    repo: "https://github.com/sameerkumar1012/Sameer.ai",
    demo: { href: "/chat", label: "Ask it anything" },
    overview:
      "A conversational interface over my own résumé. Rather than sending every question to an LLM, it tries the cheapest path that can answer correctly: an exact-match FAQ cache first, then semantic retrieval over a FAISS index, and only then a generation call. Every request passes through a guard layer before it reaches the model, and every answer passes through one on the way out.",
    architecture: [
      "Question in",
      "Validation — length, encoding, shape",
      "Prompt guard — injection detection",
      "Code guard — malicious request detection",
      "PostgreSQL FAQ cache — exact and trigram match",
      "FAISS retrieval — Titan embeddings, top-k chunks",
      "Amazon Bedrock — grounded generation over retrieved context only",
      "Output guard — sanitisation",
      "Markdown answer + cited sources out",
    ],
    highlights: [
      {
        title: "Two-tier retrieval keeps cost near zero",
        body: "Common questions resolve straight from the PostgreSQL FAQ cache without ever touching an LLM. Only novel questions pay for embedding and generation. The system degrades gracefully: if the database is unreachable, requests fall through to the RAG path instead of failing.",
      },
      {
        title: "Grounded strictly in the corpus",
        body: "The system prompt forbids outside knowledge and requires an exact refusal string when retrieved context is insufficient. This is the difference between a chatbot that represents me accurately and one that invents a job I never had.",
      },
      {
        title: "Adversarial input is handled, not assumed away",
        body: "A dedicated security package screens for prompt injection, malicious code requests and unsafe output, with a per-request budget guard on top. Most portfolio RAG demos skip this entirely.",
      },
      {
        title: "Markdown knowledge base as the source of truth",
        body: "The corpus is plain markdown, chunked by heading. Updating my résumé means editing a markdown file and rebuilding the index — no re-training, no manual data entry.",
      },
    ],
    skills: [
      "RAG",
      "Hybrid retrieval",
      "Semantic search",
      "FastAPI",
      "AWS Bedrock",
      "Docker",
      "Prompt security",
    ],
  },
  {
    slug: "calendar-ai",
    name: "Calendar.AI",
    tagline: "Self-service meeting booking straight into my Google Calendar",
    flagship: true,
    year: "2026",
    stack: ["FastAPI", "Google Calendar API", "OAuth 2.0", "Pydantic"],
    repo: "https://github.com/sameerkumar1012/Meeting_Sheduler",
    demo: { href: "/book", label: "Book a slot" },
    overview:
      "A scheduling service that reads my real calendar and writes to it. It computes genuinely free slots by intersecting my declared weekly availability with live free/busy data from the Google Calendar API, then creates a confirmed event with a Meet link and emails the attendee. No third-party scheduling SaaS in the loop.",
    architecture: [
      "Request for availability",
      "Weekly availability windows — declared per weekday",
      "Google Calendar freebusy query — next 14 days",
      "Overlap filter — drop busy and past slots",
      "Free slots out",
      "Booking request — re-validated against live availability",
      "Calendar event created with Google Meet link",
      "Invite emailed to attendee",
    ],
    highlights: [
      {
        title: "Availability is computed, not configured twice",
        body: "Slots are derived by subtracting live free/busy data from declared availability windows, so a meeting booked elsewhere immediately disappears from the options here. There is no second calendar to keep in sync.",
      },
      {
        title: "Bookings are re-validated server-side",
        body: "The requested slot is checked against live availability again at booking time, not just at display time. A stale browser tab or a hand-crafted request cannot book outside my hours or double-book an existing event.",
      },
      {
        title: "Server-side OAuth, no interactive flow",
        body: "Runs headless on a refresh token supplied through the environment. The interactive consent flow is a local one-off script, so the deployed service never needs a browser.",
      },
      {
        title: "Timezone-correct by construction",
        body: "All slot arithmetic happens in a single explicit zone (Asia/Kolkata) with timezone-aware datetimes, and events carry an explicit timeZone field, so no slot silently shifts an hour.",
      },
    ],
    skills: [
      "Google Calendar API",
      "OAuth 2.0",
      "FastAPI",
      "Timezone handling",
      "API design",
    ],
  },
  {
    slug: "insight-analyst",
    name: "Insight Analyst",
    tagline: "AI-powered data analysis agent",
    flagship: false,
    year: "2025",
    stack: ["Python", "FastAPI", "Streamlit", "Pandas", "Plotly"],
    overview:
      "A platform that automatically cleans, analyses and visualises uploaded datasets of 10,000+ records, with natural-language querying that turns questions into insights and interactive dashboards.",
    skills: ["Data cleaning", "LLM applications", "Data visualization"],
  },
  {
    slug: "aws-fraud-detection",
    name: "AWS Fraud Detection Pipeline",
    tagline: "Serverless ETL for transaction fraud analytics",
    flagship: false,
    year: "2025",
    stack: ["AWS S3", "AWS Lambda", "DynamoDB", "Python"],
    overview:
      "A serverless ETL pipeline that ingests, transforms and stores transaction records for fraud analytics. Automating ingestion through Lambda cut manual effort by 40% and improved anomaly detection.",
    skills: ["ETL pipelines", "AWS Lambda", "Serverless architecture"],
  },
  {
    slug: "careerprep-ai",
    name: "CareerPrep AI",
    tagline: "RAG interview preparation chatbot",
    flagship: false,
    year: "2025",
    stack: ["Python", "LangChain", "Streamlit", "Gemini API"],
    overview:
      "A RAG chatbot that helps users prepare for interviews from their own résumés, notes and study material, with document ingestion, vector search and contextual LLM Q&A.",
    skills: ["RAG", "LangChain", "Vector search"],
  },
  {
    slug: "ai-job-agent",
    name: "AI Job Agent",
    tagline: "Autonomous job search and résumé matching agent",
    flagship: false,
    year: "2025",
    stack: ["Python", "APScheduler", "SentenceTransformers", "Telegram Bot API"],
    overview:
      "An autonomous agent that searches job boards on a schedule, parses résumés, ranks matches by cosine similarity over embeddings, verifies fresher-eligibility with an LLM, filters duplicates and pushes alerts to Telegram.",
    skills: ["Embeddings", "Semantic search", "Agents", "Automation"],
  },
  {
    slug: "ai-first-aid",
    name: "AI First Aid Assistant",
    tagline: "Multimodal first-aid guidance",
    flagship: false,
    year: "2025",
    stack: ["Python", "Flask", "Google Gemini", "JavaScript"],
    overview:
      "A healthcare assistant that accepts both text and images for symptom analysis and returns first-aid guidance, with input validation and secure API key handling.",
    skills: ["Multimodal AI", "Prompt engineering", "REST APIs"],
  },
  {
    slug: "revision-bot",
    name: "Revision Bot",
    tagline: "Spaced-repetition scheduler for LeetCode",
    flagship: false,
    year: "2025",
    stack: ["Python", "Streamlit", "SQLite", "SQLAlchemy"],
    overview:
      "Imports solved LeetCode questions, stores them in SQLite, analyses difficulty and generates a daily revision schedule with progress tracking through a Streamlit dashboard.",
    skills: ["Automation", "SQLAlchemy", "Data management"],
  },
];

export const flagshipProjects = projects.filter((p) => p.flagship);
export const otherProjects = projects.filter((p) => !p.flagship);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
