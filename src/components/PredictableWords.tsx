import { BookOpen, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClasses } from "@/hooks/useClasses";

interface PredictableWordsProps {
  /** Optional: highlight the predicted word in the list. */
  highlight?: string;
}

/** Shows the closed vocabulary the model can recognize, as Armenian chips. */
export function PredictableWords({ highlight }: PredictableWordsProps) {
  const { words, loading, error } = useClasses();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Words the model can recognize
          {words.length > 0 && (
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
              {words.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading word list…
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground">
            Couldn’t load the word list (is the backend reachable?). The model
            still predicts one of a fixed set of Armenian words.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {words.map((word) => {
              const isActive = highlight && word === highlight;
              return (
                <span
                  key={word}
                  lang="hy"
                  className={
                    "rounded-full border px-3 py-1 text-base transition-colors " +
                    (isActive
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-secondary text-secondary-foreground")
                  }
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
