import { AlertCircle, FileScan, Loader2, PenLine, Wand2 } from "lucide-react";
import * as React from "react";

import { ImageUpload } from "@/components/ImageUpload";
import { PageOcr } from "@/components/PageOcr";
import { PredictableWords } from "@/components/PredictableWords";
import { PredictionResult } from "@/components/PredictionResult";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePrediction } from "@/hooks/usePrediction";

type Mode = "word" | "page";

export function Home() {
  const [mode, setMode] = React.useState<Mode>("word");
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const { isLoading, result, error, predict, reset } = usePrediction();

  // Manage the object URL lifecycle to avoid memory leaks.
  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelect = (next: File | null) => {
    setFile(next);
    setLocalError(null);
    reset();
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLocalError(null);
    await predict(file);
  };

  const displayError = localError ?? error;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2 text-primary-foreground">
            <PenLine className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Armenian Handwriting AI</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="container max-w-5xl pb-16">
        <section className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Recognize handwritten{" "}
            <span className="text-primary">Armenian words</span>
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Recognize a single handwritten Armenian word, or scan a whole page —
            a detector finds each word and the model labels it from a fixed set
            of Armenian words.
          </p>
        </section>

        {/* Mode toggle */}
        <div className="mx-auto mb-8 flex w-fit items-center gap-1 rounded-lg border bg-muted/40 p-1">
          {([
            { key: "word", label: "Single word", icon: Wand2 },
            { key: "page", label: "Full page", icon: FileScan },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                mode === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {mode === "page" && <PageOcr />}

        {mode === "word" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <ImageUpload
                file={file}
                previewUrl={previewUrl}
                onSelect={handleSelect}
                onError={setLocalError}
                disabled={isLoading}
              />

              {displayError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={!file || isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Recognizing…
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" /> Recognize word
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div>
            {result ? (
              <PredictionResult result={result} />
            ) : (
              <Card className="flex h-full items-center justify-center border-dashed">
                <CardContent className="py-16 text-center text-muted-foreground">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p>Analyzing your handwriting…</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Wand2 className="h-8 w-8" />
                      <p>The recognized word will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        )}

        <div className="mt-6">
          <PredictableWords highlight={mode === "word" ? result?.prediction : undefined} />
        </div>
      </main>

      <footer className="container border-t py-6 text-center text-sm text-muted-foreground">
        Built with React, FastAPI &amp; PyTorch · closed-vocabulary handwriting model
      </footer>
    </div>
  );
}
