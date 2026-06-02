import { CheckCircle2, Clock, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type PredictionResponse } from "@/types";

interface PredictionResultProps {
  result: PredictionResponse;
}

/** Displays the predicted word, confidence, inference time and top-k list. */
export function PredictionResult({ result }: PredictionResultProps) {
  const confidencePct = Math.round(result.confidence * 100);
  const alternatives = result.topk.slice(1);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CheckCircle2 className="h-5 w-5 text-primary" /> Recognition result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl bg-primary/5 p-6 text-center">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Predicted Armenian word
          </p>
          <p
            lang="hy"
            className="break-words text-5xl font-bold text-primary"
          >
            {result.prediction}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              Confidence
            </span>
            <span className="font-semibold">{confidencePct}%</span>
          </div>
          <Progress value={confidencePct} />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Inference time:{" "}
          <span className="font-medium text-foreground">
            {result.inference_ms.toFixed(1)} ms
          </span>
        </div>

        {alternatives.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4" /> Other likely words
            </p>
            <ul className="space-y-2">
              {alternatives.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span lang="hy" className="text-lg font-medium">
                    {item.label}
                  </span>
                  <div className="flex w-1/2 items-center gap-2">
                    <Progress value={Math.round(item.confidence * 100)} />
                    <span className="w-12 text-right text-sm text-muted-foreground">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
