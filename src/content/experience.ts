/** Mirrors `knowledge/experience.md` in the Sameer.ai RAG corpus. Keep in sync. */

export interface Role {
  role: string;
  company: string;
  duration: string;
  location: string;
  points: string[];
}

export const experience: Role[] = [
  {
    role: "SDE Intern",
    company: "Spectents.com",
    duration: "Feb 2026 – Apr 2026",
    location: "Remote",
    points: [
      "Developed and deployed a hybrid RAG chatbot using Python, Claude Haiku, PostgreSQL, embeddings and AWS Bedrock, enabling natural language querying of client documents.",
      "Built a multi-stage retrieval pipeline combining PostgreSQL full-text search, trigram search and rule-based matching to handle typos and transliterated Hindi text — resolving the majority of queries without an LLM call, and falling back to Claude Haiku with semantic retrieval for complex ones.",
    ],
  },
  {
    role: "Data Analyst Intern",
    company: "Computersolutionranchi.com",
    duration: "Jan 2025 – Jun 2025",
    location: "Remote",
    points: [
      "Built 8+ interactive dashboards, improving reporting efficiency.",
      "Analyzed 10,000+ records to identify trends and optimize campaign performance.",
      "Generated data-driven insights that supported business decisions and improved ROI.",
    ],
  },
];
