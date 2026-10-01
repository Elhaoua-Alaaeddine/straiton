import { Check } from "@phosphor-icons/react/ssr";
import { eligibility, hero } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { ChannelMotif } from "@/components/ui/ChannelMotif";
import { Container } from "@/components/ui/Container";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { BankQuoteButton } from "@/components/actions";

/**
 * Problem-led promise on the left, the assessment form on the right, so a
 * visitor can start immediately. The pilot criteria sit directly beneath to
 * set expectations before anyone fills in the form.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="hero-backdrop absolute inset-0 -z-10" aria-hidden="true" />
      <ChannelMotif className="absolute -top-24 -right-40 -z-10 hidden w-[56rem] text-strait-300 opacity-60 lg:block" />

      <Container className="grid grid-cols-1 gap-10 pt-10 pb-14 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pt-16 lg:pb-20 xl:gap-16">
        <div className="flex flex-col lg:col-span-7 lg:self-center lg:pb-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-small font-semibold text-fg">{hero.corridor}</span>
            <Badge variant="pending">{hero.status}</Badge>
          </p>
          <h1 id="hero-title" className="heading-display mt-6 max-w-[15ch] text-fg">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-[36rem] text-lead text-fg-muted">{hero.lead}</p>
          <div className="mt-9">
            <BankQuoteButton size="lg" className="w-full sm:w-auto" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <AssessmentForm />
        </div>
      </Container>

      <div className="border-t border-line bg-surface/70 backdrop-blur-sm">
        <Container className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="shrink-0 lg:max-w-[14rem]">
            <h2 className="text-small font-semibold text-fg">{eligibility.title}</h2>
            <p className="mt-0.5 hidden text-small text-fg-muted lg:block">{eligibility.note}</p>
          </div>
          <ul className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:flex md:flex-wrap lg:justify-end">
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
          <p className="text-small text-fg-muted lg:hidden">{eligibility.note}</p>
        </Container>
      </div>
    </section>
  );
}
