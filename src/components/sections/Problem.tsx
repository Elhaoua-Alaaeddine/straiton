import { CheckCircle, Question } from "@phosphor-icons/react/ssr";
import { problem } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Three short rows: the pain the reader recognises, then what changes. */
export function Problem() {
  return (
    <section id={problem.id} aria-labelledby="why-title" className="py-section">
      <Container>
        <div data-reveal>
          <SectionHeader id="why-title" title={problem.title} />
        </div>

        <div className="mt-12 lg:mt-16" data-reveal>
          <div
            className="hidden gap-8 pb-4 md:grid md:grid-cols-[minmax(0,2.5fr)_minmax(0,4.75fr)_minmax(0,4.75fr)]"
            aria-hidden="true"
          >
            <span />
            <span className="text-small font-semibold text-fg-subtle">{problem.columns.problem}</span>
            <span className="text-small font-semibold text-accent">{problem.columns.answer}</span>
          </div>
          <ul className="border-t border-line">
            {problem.rows.map((row) => (
              <li
                key={row.topic}
                className="grid gap-4 border-b border-line py-7 md:grid-cols-[minmax(0,2.5fr)_minmax(0,4.75fr)_minmax(0,4.75fr)] md:gap-8 md:py-9"
              >
                <h3 className="heading-3 text-fg">{row.topic}</h3>
                <div className="flex gap-3">
                  <Question size={22} className="mt-0.5 shrink-0 text-fg-subtle" aria-hidden="true" />
                  <p className="text-body text-fg-muted">
                    <span className="mb-1 block text-micro font-semibold text-fg-subtle md:sr-only">
                      {problem.columns.problem}
                    </span>
                    {row.problem}
                  </p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <p className="text-body font-medium text-fg">
                    <span className="mb-1 block text-micro font-semibold text-accent md:sr-only">
                      {problem.columns.answer}
                    </span>
                    {row.answer}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
