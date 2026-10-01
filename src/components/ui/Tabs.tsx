"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { id: string; label: string };

/**
 * WAI-ARIA tabs with automatic activation and roving tabindex.
 * Arrow keys (both axes, so a 2x2 grid of tabs still works), Home and End.
 */
export function Tabs<T extends TabItem>({
  label,
  items,
  value,
  onValueChange,
  renderTab,
  listClassName,
  panelClassName,
  children,
}: {
  label: string;
  items: ReadonlyArray<T>;
  value: string;
  onValueChange: (id: string) => void;
  renderTab?: (item: T, selected: boolean, index: number) => ReactNode;
  listClassName?: string;
  panelClassName?: string;
  children: (activeId: string) => ReactNode;
}) {
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === value),
  );

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? (activeIndex === last ? 0 : activeIndex + 1)
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (activeIndex === 0 ? last : activeIndex - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    onValueChange(items[next].id);
    refs.current[next]?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label={label} className={listClassName}>
        {items.map((item, index) => {
          const selected = item.id === value;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[index] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onValueChange(item.id)}
              onKeyDown={onKeyDown}
              className="group w-full min-w-0 text-left"
            >
              {renderTab ? renderTab(item, selected, index) : item.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${value}`}
        tabIndex={0}
        className={cn("rounded-frame", panelClassName)}
      >
        {children(value)}
      </div>
    </>
  );
}
