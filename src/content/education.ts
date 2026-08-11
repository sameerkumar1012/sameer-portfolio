/** Mirrors `knowledge/education.md` in the Sameer.ai RAG corpus. Keep in sync. */

export interface Education {
  qualification: string;
  institution: string;
  duration: string;
  result: string;
}

export const education: Education[] = [
  {
    qualification: "Bachelor of Engineering",
    institution: "Dayananda Sagar College of Engineering",
    duration: "2022 – 2026",
    result: "CGPA 8.1 / 10",
  },
  {
    qualification: "Senior Secondary",
    institution: "Surendranath Centenary School",
    duration: "2021",
    result: "78.6%",
  },
  {
    qualification: "Higher Secondary",
    institution: "Surendranath Centenary School",
    duration: "2019",
    result: "90.0%",
  },
];
