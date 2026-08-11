import { callBackend, errorResponse } from "@/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface AvailableDay {
  day: string;
  date: string;
  slots: string[];
}

export async function GET() {
  try {
    // The scheduler returns a bare array; wrap it so the response shape can
    // grow later without breaking the client.
    const days = await callBackend<AvailableDay[]>("scheduler", "/slots");
    return Response.json({ days });
  } catch (error) {
    return errorResponse(error);
  }
}
