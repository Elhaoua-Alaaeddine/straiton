"use client";

import { useRef, useState } from "react";
import { FileImage, FilePdf, UploadSimple } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { FILE_ACCEPT, formatBytes, type FileInfo } from "@/lib/validation";
import type { ControlA11y } from "./Field";
import { Button } from "./Button";

/**
 * A native file input stretched over a drop zone, so click, keyboard and
 * drag-and-drop all use the browser's own behaviour. Demo only: the file is
 * read for its name, size and type and never leaves the device.
 */
export function FileInput({
  a11y,
  file,
  onFileChange,
  labels,
  disabled,
  force,
}: {
  a11y: ControlA11y;
  file: FileInfo | null;
  onFileChange: (file: FileInfo | null) => void;
  labels: { choose: string; drop: string; remove: string; hint?: string; stays: string };
  disabled?: boolean;
  force?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const invalid = a11y["aria-invalid"];
  const Icon = file?.type.startsWith("image/") ? FileImage : file ? FilePdf : UploadSimple;

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    onFileChange(null);
    inputRef.current?.focus();
  }

  return (
    <div>
      <div
        data-dragging={dragging || undefined}
        className={cn(
          "relative flex min-h-24 items-center gap-4 rounded-card border-2 border-dashed px-4 py-4 transition-[background-color,border-color] duration-200 ease-out-soft",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus",
          force === "focus" && "outline-2 outline-offset-2 outline-focus",
          invalid ? "border-danger-line bg-danger-bg" : file ? "border-line-strong bg-surface" : "border-line-strong bg-surface-sunken",
          "data-dragging:border-action data-dragging:bg-accent-soft",
          !disabled && "hover:border-fg-muted",
        )}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
      >
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-control",
            file ? "bg-accent-soft text-accent" : "bg-surface text-fg-muted shadow-soft",
          )}
          aria-hidden="true"
        >
          <Icon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          {file ? (
            <>
              <span className="block truncate font-semibold text-fg">{file.name}</span>
              <span className="block text-small text-fg-muted">
                {formatBytes(file.size)}. {labels.stays}
              </span>
            </>
          ) : (
            <>
              <span className="block font-semibold text-accent">
                {labels.choose} <span className="font-normal text-fg-muted">{labels.drop}</span>
              </span>
              {labels.hint ? <span className="block text-small text-fg-muted">{labels.hint}</span> : null}
            </>
          )}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={FILE_ACCEPT}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...a11y}
          onChange={(event) => {
            const selected = event.target.files?.[0];
            setDragging(false);
            onFileChange(selected ? { name: selected.name, size: selected.size, type: selected.type } : null);
          }}
        />
        {file ? (
          // Sits above the stretched file input so it stays clickable.
          <Button
            variant="secondary"
            size="sm"
            onClick={clear}
            disabled={disabled}
            className="relative z-10 shrink-0 whitespace-nowrap"
          >
            {labels.remove}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
