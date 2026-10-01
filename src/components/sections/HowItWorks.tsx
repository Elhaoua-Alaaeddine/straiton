"use client";

import { useState } from "react";
import { ArrowRight, Headset } from "@phosphor-icons/react/ssr";
import { ctas, howItWorks, type StageId } from "@/content/site";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { WorkspacePreview } from "@/components/product/WorkspacePreview";

/**
 * Four stages as keyboard-accessible tabs. Choosing a stage switches the
 * illustrative workspace to that state. Tabs sit in a 2x2 grid on phones and
 * a vertical list on desktop; never a horizontal scrolling strip.
 */
export function HowItWorks() {
  const [stage, setStage] = useState<StageId>("share");

  return (
    <section id={howItWorks.id} aria-labelledby="how-title" className="py-section">
      <Container>
        <div data-reveal>
          <SectionHeader id="how-title" title={howItWorks.title} lead={howItWorks.lead} />
        </div>

        {/* Grid children: tab list, tab panel (spans two rows on desktop), manager link. */}
        <div
          className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12"
          data-reveal
        >
          <Tabs
            label={howItWorks.tabsLabel}
            items={howItWorks.stages}
            value={stage}
            onValueChange={(id) => setStage(id as StageId)}
            listClassName="grid grid-cols-2 gap-2 lg:col-span-4 lg:grid-cols-1 lg:gap-3"
            panelClassName="min-w-0 lg:col-span-8 lg:row-span-2"
            renderTab={(item, selected, index) => (
              <span
                className={cn(
                  "flex h-full min-h-14 items-center gap-3 rounded-card border px-3.5 py-3 transition-[background-color,border-color,color,box-shadow] duration-200 ease-out-soft lg:items-start lg:px-5 lg:py-4",
                  selected ? "border-action bg-accent-soft shadow-soft" : "border-line bg-surface group-hover:border-fg-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-pill text-micro font-semibold tabular-nums",
                    selected ? "bg-action text-action-fg" : "border border-line-strong text-fg-muted",
                  )}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn("block font-semibold", selected ? "text-accent" : "text-fg")}>{item.label}</span>
                  <span className="hidden text-small text-fg-muted lg:block">{item.title}</span>
                </span>
              </span>
            )}
          >
            {(active) => {
              const current = howItWorks.stages.find((s) => s.id === active) ?? howItWorks.stages[0];
              return (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="max-w-xl">
                      <h3 className="heading-3 text-fg">{current.title}</h3>
                      <p className="mt-2 text-body text-fg-muted">{current.body}</p>
                    </div>
                    <Badge variant="accent" className="self-start">
                      You get: {current.output}
                    </Badge>
                  </div>
                  <WorkspacePreview stage={current.id} />
                </div>
              );
            }}
          </Tabs>

          <a
            href={ctas.manager.href}
            className="group flex items-center gap-3 self-start rounded-card border border-dashed border-line-strong p-4 text-small transition-colors hover:border-fg-muted lg:col-span-4"
          >
            <Headset size={20} className="shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-fg">{howItWorks.managerNote}</span>
              <span className="block text-accent group-hover:underline">{ctas.manager.label}</span>
            </span>
            <ArrowRight size={16} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
