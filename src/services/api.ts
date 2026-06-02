import {
  ApiError,
  type ClassesResponse,
  type HealthResponse,
  type PredictionResponse,
} from "@/types";

/**
 * Base URL of the backend. Configured via the `VITE_API_URL` environment
 * variable; falls back to localhost for development. Any trailing slash is
 * trimmed so paths can be concatenated safely.
 */
const DEFAULT_API_URL = "https://alengevorgyan-armenian-htr.hf.space";
const API_URL = (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(
  /\/+$/,
  "",
);

/** Default time after which a request is aborted (ms). */
const REQUEST_TIMEOUT_MS = 30_000;

async function withTimeout<T>(
  run: (signal: AbortSignal) => Promise<T>,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await run(controller.signal);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 408);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Could not reach the recognition service. Check your connection and the API URL.",
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

async function parseError(response: Response): Promise<never> {
  let detail = `Request failed with status ${response.status}.`;
  try {
    const body = (await response.json()) as { detail?: string };
    if (body?.detail) detail = body.detail;
  } catch {
    /* ignore non-JSON error bodies */
  }
  throw new ApiError(detail, response.status);
}

/** Send an image to the backend and return the recognised word. */
export async function predictImage(file: File): Promise<PredictionResponse> {
  return withTimeout(async (signal) => {
    const form = new FormData();
    form.append("image", file);
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: form,
      signal,
    });
    if (!response.ok) await parseError(response);
    return (await response.json()) as PredictionResponse;
  });
}

/** Query backend health (used to show service status in the UI). */
export async function checkHealth(): Promise<HealthResponse> {
  return withTimeout(async (signal) => {
    const response = await fetch(`${API_URL}/health`, { signal });
    if (!response.ok) await parseError(response);
    return (await response.json()) as HealthResponse;
  }, 8_000);
}

/** Fetch the closed vocabulary the model can predict. */
export async function getClasses(): Promise<ClassesResponse> {
  return withTimeout(async (signal) => {
    const response = await fetch(`${API_URL}/classes`, { signal });
    if (!response.ok) await parseError(response);
    return (await response.json()) as ClassesResponse;
  }, 8_000);
}

export const apiBaseUrl = API_URL;
