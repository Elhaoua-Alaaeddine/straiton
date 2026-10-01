"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "@phosphor-icons/react/ssr";
import { useFocusTrap, useScrollLock } from "@/lib/a11y";
import { cn } from "@/lib/cn";

/**
 * Modal dialog on the native <dialog> element: the page behind is inert,
 * Esc closes it, focus is trapped inside and returns to the trigger on close,
 * and page scrolling is locked. Bottom sheet on phones, centred on larger screens.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  closeLabel = "Close",
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  closeLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useScrollLock(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      returnFocus.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="st-dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div
        className="flex h-full items-end justify-center sm:items-center sm:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          ref={panelRef}
          className={cn(
            "st-dialog-panel flex max-h-[calc(100dvh-0.75rem)] w-full flex-col overflow-hidden rounded-t-frame bg-surface text-fg shadow-float",
            "sm:max-h-[calc(100dvh-3rem)] sm:max-w-xl sm:rounded-frame",
            className,
          )}
        >
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
            <div className="min-w-0">
              <h2 id={titleId} className="heading-3 text-fg">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="mt-1.5 text-small text-fg-muted">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="-mt-1 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-control text-fg-muted transition-colors is-hover:bg-surface-tint is-hover:text-fg"
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </button>
          </header>
          <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">{children}</div>
        </div>
      </div>
    </dialog>
  );
}
