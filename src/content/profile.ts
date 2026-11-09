/**
 * Source of truth for identity + contact details shown across the site.
 *
 * NOTE: these facts are duplicated in the Sameer.ai RAG knowledge base
 * (`knowledge/profile.md`). If you change one, change the other — otherwise
 * the chatbot will contradict the page it is embedded in.
 */

export const profile = {
  name: "Sameer Kumar",
  title: "AI Customer Success Associate",
  siteUrl: "https://sameerkumar.dev",
  location: "Bangalore, India",
  email: "sameerkumar1012@gmail.com",
  phone: "+91 6204207664",
  github: "https://github.com/sameerkumar1012",
  linkedin: "https://www.linkedin.com/in/sameer-kumar1012/",

  summary:
    "AI Customer Success Associate helping customers get real value from AI-powered products, with a technical background building the chatbots, pipelines and backend services behind them.",

  intro:
    "I help customers succeed with AI-powered products, backed by hands-on experience building the systems behind them — chatbots, data pipelines and backend services. That mix lets me translate between what a customer needs and what the product can actually do, whether that's unblocking an issue, explaining how a feature works, or flagging what to build next.",

  availability: [
    "Recent engineering graduate",
    "Open to full-time opportunities",
    "Based in Bangalore, India",
    "Available for remote, hybrid and onsite roles",
  ],
} as const;
