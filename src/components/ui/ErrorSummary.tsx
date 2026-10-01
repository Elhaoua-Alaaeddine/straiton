"use client";

import { useId, type Ref } from "react";
import { WarningCircle } from "@phosphor-icons/react/ssr";
import { errorSummary } from "@/content/forms";

export type SummaryItem = { id: string; message: string };

/**
 * Shown when a step is submitted with errors. It receives focus so screen
 * readers announce it, and each item links to (and focuses) its field.
 */
export function ErrorSummary({ items, ref }: { items: SummaryItem[]; ref?: Ref<HTMLDivElement> }) {
  const titleId = useId();
  if (items.length === 0) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="group"
      aria-labelledby={titleId}
      className="rounded-card border border-danger-line bg-danger-bg p-4 sm:p-5"
    >
      <h3 id={titleId} className="flex items-center gap-2 text-body font-semibold text-danger-fg">
        <WarningCircle size={20} weight="fill" aria-hidden="true" />
        {errorSummary.title(items.length)}
      </h3>
      <ul className="mt-2 flex flex-col gap-1 pl-7">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-small font-medium text-danger-fg underline underline-offset-2 hover:decoration-2"
              onClick={(event) => {
                event.preventDefault();
                const field = document.getElementById(item.id);
                field?.scrollIntoView({ block: "center" });
                field?.focus({ preventScroll: true });
              }}
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
