"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Plus } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

export type AccordionItem = { id: string; question: string; answer: ReactNode };

/**
 * WAI-ARIA accordion: real buttons with aria-expanded and aria-controls,
 * Up/Down/Home/End move between headers, several panels can be open.
 */
export function Accordion({
  items,
  defaultOpen = [],
  headingLevel = 3,
  className,
}: {
  items: ReadonlyArray<AccordionItem>;
  defaultOpen?: string[];
  headingLevel?: 2 | 3 | 4;
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpen));
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const Heading = `h${headingLevel}` as "h3";

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    const target =
      event.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  }

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-b border-line">
            <Heading className="m-0">
              <button
                ref={(el) => {
                  buttons.current[index] = el;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left text-body font-semibold text-fg transition-colors duration-200 is-hover:text-accent"
              >
                <span>{item.question}</span>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-pill border border-line text-fg-muted transition-[transform,background-color,border-color,color] duration-300 ease-out-soft",
                    "group-hover:border-fg-muted group-hover:text-fg",
                    isOpen && "rotate-45 border-transparent bg-accent-soft text-accent",
                  )}
                  aria-hidden="true"
                >
                  <Plus size={16} weight="bold" />
                </span>
              </button>
            </Heading>
            <div id={panelId} className="accordion-panel" data-open={isOpen}>
              <div className="overflow-hidden">
                <div className="max-w-copy pr-12 pb-6 text-body text-fg-muted">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
