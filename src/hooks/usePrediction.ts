import { useCallback, useState } from "react";

import { predictImage } from "@/services/api";
import { ApiError, type PredictionResponse } from "@/types";

type Status = "idle" | "loading" | "success" | "error";

interface UsePredictionState {
  status: Status;
  result: PredictionResponse | null;
  error: string | null;
}

const INITIAL: UsePredictionState = {
  status: "idle",
  result: null,
  error: null,
};

/** Encapsulates the predict request lifecycle (loading/success/error). */
export function usePrediction() {
  const [state, setState] = useState<UsePredictionState>(INITIAL);

  const predict = useCallback(async (file: File) => {
    setState({ status: "loading", result: null, error: null });
    try {
      const result = await predictImage(file);
      setState({ status: "success", result, error: null });
      return result;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong while recognising the image.";
      setState({ status: "error", result: null, error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState(INITIAL), []);

  return {
    ...state,
    isLoading: state.status === "loading",
    predict,
    reset,
  };
}
