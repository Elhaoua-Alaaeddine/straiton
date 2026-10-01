import { ArrowRight } from "@phosphor-icons/react/ssr";
import { demo, faq } from "@/content/site";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DemoAction } from "@/components/actions";

/**
 * Honest answers, with the same-day question open by default.
 * The guides list renders once: grid placement puts it under the heading on
 * desktop and after the questions on phones, so nothing is duplicated.
 */
export function Faq() {
  return (
    <section id={faq.id} aria-labelledby="faq-title" className="py-section">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10">
        <div className="lg:col-span-4 lg:row-start-1" data-reveal>
          <SectionHeader id="faq-title" title={faq.title} lead={faq.lead} />
        </div>
        <div className="lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1" data-reveal>
          <Accordion items={faq.items} defaultOpen={["same-day"]} />
        </div>
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:col-span-4 lg:row-start-2 lg:self-start">
          <GuideList />
        </div>
      </Container>
    </section>
  );
}

function GuideList() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h3 className="text-small font-semibold text-fg">{faq.guides.title}</h3>
        <Badge variant="demo" size="sm">
          {demo.label}
        </Badge>
      </div>
      <ul className="mt-3 border-t border-line">
        {faq.guides.items.map((title) => (
          <li key={title} className="border-b border-line">
            <DemoAction
              message="guide"
              variant="plain"
              showTag={false}
              className="w-full justify-between gap-4 py-3 text-small"
              icon={null}
            >
              <span className="flex items-center justify-between gap-4">
                {title}
                <ArrowRight size={16} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
              </span>
            </DemoAction>
          </li>
        ))}
      </ul>
    </div>
  );
}
