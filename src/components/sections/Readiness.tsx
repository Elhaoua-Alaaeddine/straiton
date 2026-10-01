import { Check, Info, ListChecks, ShieldCheck, X } from "@phosphor-icons/react/ssr";
import { readiness } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** First navy section: the preparation Straiton does before any money moves. */
export function Readiness() {
  return (
    <section
      id={readiness.id}
      aria-labelledby="readiness-title"
      className="surface-navy navy-glow relative isolate overflow-hidden py-section"
    >
      <Container>
        <div data-reveal>
          <SectionHeader id="readiness-title" title={readiness.title} lead={readiness.lead} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:mt-16 lg:grid-cols-2 lg:gap-6" data-reveal>
          <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
            <h3 className="flex items-center gap-3 text-lead font-semibold text-fg">
              <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent">
                <ListChecks size={20} aria-hidden="true" />
              </span>
              {readiness.checks.title}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {readiness.checks.items.map((item) => (
                <li key={item} className="flex gap-3 text-body text-fg">
                  <Check size={18} weight="bold" className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
            <h3 className="flex items-center gap-3 text-lead font-semibold text-fg">
              <span className="flex size-10 items-center justify-center rounded-control bg-accent-soft text-accent">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              {readiness.avoids.title}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {readiness.avoids.items.map((item) => (
                <li key={item} className="flex gap-3 text-body text-fg">
                  <X size={18} weight="bold" className="mt-1 shrink-0 text-fg-subtle" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 flex max-w-3xl gap-3 text-small text-fg-muted" data-reveal>
          <Info size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          {readiness.caveat}
        </p>
      </Container>
    </section>
  );
}
