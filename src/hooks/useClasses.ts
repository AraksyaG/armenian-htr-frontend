import { useEffect, useState } from "react";

import { getClasses } from "@/services/api";

interface UseClassesState {
  words: string[];
  loading: boolean;
  error: string | null;
}

/** Fetch the model's predictable vocabulary once on mount. */
export function useClasses() {
  const [state, setState] = useState<UseClassesState>({
    words: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    getClasses()
      .then((res) => {
        if (!cancelled) {
          setState({ words: res.classes, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            words: [],
            loading: false,
            error:
              err instanceof Error ? err.message : "Could not load word list.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
