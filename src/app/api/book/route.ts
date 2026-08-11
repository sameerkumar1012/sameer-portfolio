import { callBackend, errorResponse } from "@/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BookingResult {
  status: string;
  message: string;
  meeting?: {
    date: string;
    time: string;
    duration: string;
    meet_link?: string;
    calendar_link?: string;
  };
}

const FIELDS = ["name", "email", "purpose", "date", "time"] as const;

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Malformed request body." }, { status: 400 });
  }

  const booking: Record<string, string> = {};
  for (const field of FIELDS) {
    const value = payload[field];
    if (typeof value !== "string" || !value.trim()) {
      return Response.json(
        { error: `Missing required field: ${field}.` },
        { status: 400 },
      );
    }
    booking[field] = value.trim();
  }

  try {
    // The scheduler re-checks the slot against live availability, so this
    // proxy deliberately does not try to validate the slot itself.
    const result = await callBackend<BookingResult>("scheduler", "/book", {
      method: "POST",
      body: booking,
    });
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
