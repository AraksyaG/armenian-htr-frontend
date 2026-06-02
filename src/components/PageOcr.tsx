import { AlertCircle, FileScan, Loader2 } from "lucide-react";
import * as React from "react";

import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ocrImage } from "@/services/api";
import { ApiError, type OcrResponse } from "@/types";

/**
 * Full-page mode: upload a page, the backend detects every word (YOLO) and
 * classifies each crop, then we overlay the boxes + recognized words and show
 * the reading-order text.
 */
export function PageOcr() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<OcrResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      setResult(await ocrImage(file));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Page OCR failed. Is the backend reachable?",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-5 pt-6">
          <ImageUpload
            file={file}
            previewUrl={previewUrl}
            onSelect={handleSelect}
            onError={setError}
            disabled={loading}
          />
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Upload a full page of handwriting. The detector finds each word and
            the model labels it — but it only knows the {""}
            <strong>fixed word list</strong>, so words outside it will be
            mislabeled.
          </p>
          <Button
            className="w-full"
            size="lg"
            disabled={!file || loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Detecting &
                recognizing…
              </>
            ) : (
              <>
                <FileScan className="h-5 w-5" /> Detect & recognize words
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result && previewUrl ? (
          <>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">
                  Detected {result.count} words
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative inline-block max-w-full">
                  <img
                    src={previewUrl}
                    alt="Page with detected words"
                    className="max-w-full rounded-lg border"
                  />
                  {result.words.map((w, i) => {
                    const [x1, y1, x2, y2] = w.box;
                    const good = w.confidence >= 0.5;
                    return (
                      <div
                        key={i}
                        title={`${w.word} (${Math.round(w.confidence * 100)}%)`}
                        className={
                          "absolute border-2 " +
                          (good ? "border-primary/70" : "border-amber-500/60")
                        }
                        style={{
                          left: `${(x1 / result.width) * 100}%`,
                          top: `${(y1 / result.height) * 100}%`,
                          width: `${((x2 - x1) / result.width) * 100}%`,
                          height: `${((y2 - y1) / result.height) * 100}%`,
                        }}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Recognized text (reading order)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  lang="hy"
                  className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-base leading-relaxed"
                >
                  {result.text}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="flex h-full items-center justify-center border-dashed">
            <CardContent className="py-16 text-center text-muted-foreground">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Detecting and recognizing words…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <FileScan className="h-8 w-8" />
                  <p>Detected words and text will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
