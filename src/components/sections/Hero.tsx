import { Check } from "@phosphor-icons/react/ssr";
import { eligibility, hero } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { ChannelMotif } from "@/components/ui/ChannelMotif";
import { Container } from "@/components/ui/Container";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { BankQuoteButton } from "@/components/actions";

/**
 * Problem-led promise, then the assessment form, then the bank-quote option.
 * That is the source order, so phones read lead, form, button. On desktop,
 * grid placement puts the intro and button in the left column and the form
 * on the right, with the left group centred against the taller form.
 * The pilot criteria sit directly beneath to set expectations.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="hero-backdrop absolute inset-0 -z-10" aria-hidden="true" />
      <ChannelMotif className="absolute -top-24 -right-40 -z-10 hidden w-[56rem] text-strait-300 opacity-60 lg:block" />

      <Container className="grid grid-cols-1 gap-8 pt-10 pb-14 sm:pt-14 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-12 lg:gap-y-0 lg:pt-16 lg:pb-20 xl:gap-x-16">
        <div className="lg:col-span-7 lg:row-start-2">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-small font-semibold text-fg">{hero.corridor}</span>
            <Badge variant="pending">{hero.status}</Badge>
          </p>
          <h1 id="hero-title" className="heading-display mt-6 max-w-[15ch] text-fg">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-[36rem] text-lead text-fg-muted">{hero.lead}</p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1">
          <AssessmentForm />
        </div>

        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:mt-9 lg:pb-6">
          <BankQuoteButton size="lg" className="w-full sm:w-auto" />
        </div>
      </Container>

      <div className="border-t border-line bg-surface/70 backdrop-blur-sm">
        {/* One note element: under the title on desktop, after the criteria on phones. */}
        <Container className="grid grid-cols-1 gap-4 py-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-center lg:gap-x-8 lg:gap-y-0.5">
          <h2 className="text-small font-semibold text-fg lg:col-start-1 lg:row-start-1 lg:self-end">{eligibility.title}</h2>
          <ul className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:flex md:flex-wrap lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-end">
            {eligibility.items.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-3.5 py-2 text-small font-medium text-fg"
              >
                <Check size={14} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-small text-fg-muted lg:col-start-1 lg:row-start-2 lg:self-start">{eligibility.note}</p>
        </Container>
      </div>
    </section>
  );
}
