/** Shared TypeScript types for the Armenian HTR frontend. */

/** One alternative prediction returned in the top-k list. */
export interface TopKItem {
  label: string;
  confidence: number;
}

/** Successful response from the backend `POST /predict` endpoint. */
export interface PredictionResponse {
  prediction: string;
  confidence: number;
  inference_ms: number;
  topk: TopKItem[];
}

/** Backend `GET /health` response. */
export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  architecture: string;
  num_classes: number;
  device: string;
}

/** Backend `GET /classes` response — the words the model can predict. */
export interface ClassesResponse {
  count: number;
  classes: string[];
}

/** Normalised API error surfaced to the UI. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
