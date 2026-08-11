/**
 * Server-only helper for talking to the two Python services.
 *
 * Everything here runs inside Next.js route handlers, never in the browser —
 * that is what keeps the backend URLs and the shared secret off the client.
 */

import "server-only";

export type BackendName = "rag" | "scheduler";

/** Free-tier hosts sleep; a cold start can take ~50s before the first byte. */
const TIMEOUT_MS = 60_000;

export class BackendError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** True when the backend never answered — the UI shows a "waking" state. */
    readonly coldStart = false,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

function baseUrl(backend: BackendName): string {
  const url =
    backend === "rag"
      ? process.env.RAG_API_URL
      : process.env.SCHEDULER_API_URL;

  if (!url) {
    throw new BackendError(
      `${backend === "rag" ? "RAG_API_URL" : "SCHEDULER_API_URL"} is not configured.`,
      503,
    );
  }
  return url.replace(/\/$/, "");
}

interface CallOptions {
  method?: "GET" | "POST";
  body?: unknown;
  /** Appended to the path as a query string. */
  query?: Record<string, string>;
}

export async function callBackend<T>(
  backend: BackendName,
  path: string,
  { method = "GET", body, query }: CallOptions = {},
): Promise<T> {
  const url = new URL(baseUrl(backend) + path);
  for (const [k, v] of Object.entries(query ?? {})) {
    url.searchParams.set(k, v);
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const secret = process.env.BACKEND_SHARED_SECRET;
  if (secret) headers["X-Portfolio-Secret"] = secret;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut =
      error instanceof DOMException && error.name === "TimeoutError";
    throw new BackendError(
      timedOut
        ? "The service is still waking up. Try again in a moment."
        : "Could not reach the service.",
      503,
      true,
    );
  }

  if (!response.ok) {
    // Surface the backend's own message when it sends one — the guard layer
    // in Sameer.ai returns useful text for blocked prompts.
    let detail = `Request failed with status ${response.status}.`;
    try {
      const payload = (await response.json()) as {
        detail?: unknown;
        error?: unknown;
        message?: unknown;
      };
      const candidate = payload.detail ?? payload.error ?? payload.message;
      if (typeof candidate === "string" && candidate.trim()) {
        detail = candidate;
      }
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new BackendError(detail, response.status);
  }

  return (await response.json()) as T;
}

/** Turns any thrown value into a JSON Response for a route handler. */
export function errorResponse(error: unknown): Response {
  if (error instanceof BackendError) {
    return Response.json(
      { error: error.message, coldStart: error.coldStart },
      { status: error.status },
    );
  }
  console.error("Unexpected backend failure:", error);
  return Response.json({ error: "Something went wrong." }, { status: 500 });
}
