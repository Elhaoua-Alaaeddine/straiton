import type { Icon } from "@phosphor-icons/react";
import {
  ArrowRight,
  ArrowsLeftRight,
  Buildings,
  CheckCircle,
  Headset,
  Lightning,
  ListChecks,
  MapPinLine,
  Receipt,
} from "@phosphor-icons/react/ssr";
import { corridor } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const ICONS: Record<string, Icon> = {
  speed: Lightning,
  types: Receipt,
  beneficiary: Buildings,
  fx: ArrowsLeftRight,
  documents: ListChecks,
  tracking: MapPinLine,
  support: Headset,
};

/**
 * The corridor spec, split honestly: what is set for the pilot leads, and the
 * operational details still being confirmed sit in a compact secondary list.
 */
export function Corridor() {
  const { route, facts, pending } = corridor;
  return (
    <section id={corridor.id} aria-labelledby="corridor-title" className="py-section">
      <Container>
        <div data-reveal>
          <SectionHeader id="corridor-title" title={corridor.title} lead={corridor.lead} />
        </div>

        <div className="mt-12" data-reveal>
          <h3 className="flex items-center gap-2 text-body font-semibold text-fg">
            <CheckCircle size={20} weight="fill" className="text-accent" aria-hidden="true" />
            {corridor.setTitle}
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {/* Lead tile: route and currencies */}
            <div className="surface-navy navy-glow relative overflow-hidden rounded-card p-6 sm:p-8 md:col-span-2">
              <div className="grid gap-8">
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3 sm:gap-6">
                  <div className="min-w-0">
                    <p className="text-small text-fg-muted">{route.fromLabel}</p>
                    <p className="mt-1 text-lead font-semibold text-fg">{route.from}</p>
                  </div>
                  <span className="mb-2 flex items-center gap-1 text-accent" aria-hidden="true">
                    <span className="hidden h-0.5 w-10 rounded-pill bg-linear-to-r from-transparent to-strait-300 sm:block lg:w-16" />
                    <ArrowRight size={18} weight="bold" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-small text-fg-muted">{route.toLabel}</p>
                    <p className="mt-1 text-lead font-semibold text-fg">{route.to}</p>
                  </div>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3 border-t border-line pt-6 sm:gap-6">
                  <div className="min-w-0">
                    <p className="text-small text-fg-muted">{route.fundLabel}</p>
                    <p className="mt-2 text-h3 font-semibold tracking-tight text-fg sm:heading-2">{route.fund}</p>
                  </div>
                  <span className="mb-3 flex items-center gap-1 text-accent" aria-hidden="true">
                    <span className="hidden h-0.5 w-10 rounded-pill bg-linear-to-r from-transparent to-strait-300 sm:block lg:w-16" />
                    <ArrowRight size={18} weight="bold" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-small text-fg-muted">{route.receiveLabel}</p>
                    <p className="mt-2 text-h3 font-semibold tracking-tight text-accent sm:heading-2">{route.receive}</p>
                  </div>
                </div>
              </div>
            </div>

            {facts.map((fact) => {
              const Icon = ICONS[fact.icon];
              return (
                <div key={fact.label} className="flex min-h-40 flex-col justify-between gap-6 rounded-card border border-line bg-surface p-6">
                  <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-small text-fg-muted">{fact.label}</p>
                    <p className="mt-1 text-body font-semibold text-fg">{fact.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 rounded-card border border-line bg-surface-sunken p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center lg:gap-10">
            <div>
              <h3 className="text-body font-semibold text-fg">{pending.title}</h3>
              <p className="mt-1 text-small text-fg-muted">{pending.note}</p>
            </div>
            <ul className="divide-y divide-line rounded-control border border-line bg-surface">
              {pending.items.map((item) => (
                <li key={item} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
                  <span className="text-small font-medium text-fg">{item}</span>
                  <Badge variant="pending" size="sm">
                    {pending.badge}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
