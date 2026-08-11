import { callBackend, errorResponse } from "@/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_LENGTH = 500;

interface RagResponse {
  answer?: string;
  markdown?: string;
  sources?: { source: string; title: string }[];
}

export async function POST(request: Request) {
  let question: unknown;
  try {
    ({ question } = await request.json());
  } catch {
    return Response.json({ error: "Malformed request body." }, { status: 400 });
  }

  if (typeof question !== "string" || !question.trim()) {
    return Response.json({ error: "Ask a question first." }, { status: 400 });
  }
  // The backend validates too; this just avoids paying for an obvious reject.
  if (question.length > MAX_QUESTION_LENGTH) {
    return Response.json(
      { error: `Keep questions under ${MAX_QUESTION_LENGTH} characters.` },
      { status: 400 },
    );
  }

  try {
    const data = await callBackend<RagResponse>("rag", "/chat", {
      method: "POST",
      body: { question: question.trim() },
    });

    return Response.json({
      answer: data.answer ?? data.markdown ?? "",
      sources: data.sources ?? [],
    });
  } catch (error) {
    return errorResponse(error);
  }
}
