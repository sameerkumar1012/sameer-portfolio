/** Mirrors `knowledge/skills.md` in the Sameer.ai RAG corpus. Keep in sync. */

export interface SkillGroup {
  label: string;
  items: string[];
  /** Groups marked primary are surfaced first and given more visual weight. */
  primary?: boolean;
}

export const skillGroups: SkillGroup[] = [
  {
    label: "AI & GenAI",
    primary: true,
    items: [
      "RAG (Retrieval-Augmented Generation)",
      "Hybrid retrieval",
      "Semantic search",
      "Prompt engineering",
      "LLM applications",
      "Prompt-injection defence",
    ],
  },
  {
    label: "Libraries & Frameworks",
    primary: true,
    items: [
      "FastAPI",
      "LangChain",
      "LangGraph",
      "FAISS",
      "Pandas",
      "NumPy",
      "PySpark",
    ],
  },
  {
    label: "Cloud & Data Warehousing",
    primary: true,
    items: [
      "AWS Bedrock",
      "AWS S3",
      "AWS Lambda",
      "AWS Athena",
      "Snowflake",
      "Docker",
    ],
  },
  {
    label: "Programming",
    items: ["Python", "SQL", "C"],
  },
  {
    label: "Data Engineering",
    items: [
      "ETL pipelines",
      "Data processing",
      "Data transformation",
      "Data modeling",
      "Data warehousing",
    ],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "SQLAlchemy"],
  },
  {
    label: "Data Analysis",
    items: [
      "EDA",
      "Data cleaning",
      "Statistical analysis",
      "Data visualization",
    ],
  },
  {
    label: "Visualization Tools",
    items: ["Tableau", "Power BI", "Excel (Advanced)"],
  },
  {
    label: "Business",
    items: [
      "KPI tracking",
      "Requirement gathering",
      "Stakeholder communication",
    ],
  },
];
