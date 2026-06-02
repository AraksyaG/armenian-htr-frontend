import { ImagePlus, UploadCloud, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

interface ImageUploadProps {
  /** Currently selected file (controlled). */
  file: File | null;
  /** Object URL preview of the selected file. */
  previewUrl: string | null;
  /** Called with a valid file, or `null` when cleared. */
  onSelect: (file: File | null) => void;
  /** Optional validation-error callback. */
  onError?: (message: string) => void;
  disabled?: boolean;
}

/** Drag-and-drop + file-picker image uploader with preview. */
export function ImageUpload({
  file,
  previewUrl,
  onSelect,
  onError,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const validateAndSelect = React.useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return;
      if (!ACCEPTED_TYPES.includes(candidate.type)) {
        onError?.("Unsupported file type. Use JPG, PNG, BMP or WEBP.");
        return;
      }
      if (candidate.size > MAX_BYTES) {
        onError?.("File is too large (max 10 MB).");
        return;
      }
      onSelect(candidate);
    },
    [onError, onSelect],
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    validateAndSelect(e.dataTransfer.files?.[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSelect(e.target.files?.[0]);
    // Reset so selecting the same file again still fires onChange.
    e.target.value = "";
  };

  const openPicker = () => inputRef.current?.click();

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload an image"
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openPicker();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/60 hover:bg-accent/40",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {previewUrl ? (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Selected handwriting preview"
              className="max-h-48 max-w-full rounded-lg border bg-white object-contain shadow-sm"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-3 -top-3 h-8 w-8 rounded-full"
              onClick={clear}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="max-w-full truncate text-sm text-muted-foreground">
            {file?.name}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={openPicker}>
            <ImagePlus className="h-4 w-4" /> Choose another
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-primary/10 p-4 text-primary transition-transform group-hover:scale-105">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium">
              Drag &amp; drop an image here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse — JPG, PNG, BMP, WEBP (max 10 MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
