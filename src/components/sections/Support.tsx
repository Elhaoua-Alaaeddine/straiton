import { EnvelopeSimple, Flask, Phone, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { support } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DemoButton } from "@/components/actions";

const CHANNEL_ICONS = {
  whatsapp: <WhatsappLogo size={20} className="shrink-0" aria-hidden="true" />,
  phone: <Phone size={20} className="shrink-0" aria-hidden="true" />,
  email: <EnvelopeSimple size={20} className="shrink-0" aria-hidden="true" />,
} as const;

/** An email address that may wrap only after the "@", never mid-word. */
function EmailLabel({ address }: { address: string }) {
  const at = address.indexOf("@");
  if (at < 0) return <>{address}</>;
  return (
    <>
      <span className="whitespace-nowrap">{address.slice(0, at + 1)}</span>
      <wbr />
      <span className="whitespace-nowrap">{address.slice(at + 1)}</span>
    </>
  );
}

/**
 * The India payments manager, introduced by role (no invented person or
 * photo). Every channel is a labelled demo placeholder.
 */
export function Support() {
  const { card } = support;
  return (
    <section id={support.id} aria-labelledby="support-title" className="bg-surface-tint py-section">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 xl:col-span-6" data-reveal>
          <SectionHeader id="support-title" title={support.title} lead={support.lead} />
          <h3 className="mt-8 text-small font-semibold text-fg">{support.helpsWithTitle}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {support.helpsWith.map((topic) => (
              <li
                key={topic}
                className="rounded-pill border border-line bg-surface px-3.5 py-2 text-small font-medium text-fg"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 xl:col-span-6" data-reveal>
          <div className="rounded-frame border border-line bg-surface p-6 shadow-raised sm:p-8">
            {/* Phones: the Demo pill drops to its own line under the title. Wider: it sits top right. */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-2 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
              <span className="row-span-2 flex size-12 shrink-0 items-center justify-center rounded-card bg-surface-tint sm:row-span-1 sm:size-14">
                <LogoMark size={28} />
              </span>
              <div className="min-w-0">
                <h3 className="heading-3 text-fg">{card.role}</h3>
                <p className="mt-1 text-small text-fg-muted">{card.team}</p>
              </div>
              <Badge variant="demo" className="col-start-2 justify-self-start sm:col-start-3 sm:row-start-1">
                Demo
              </Badge>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              {card.channels.map((channel, index) => (
                <DemoButton
                  key={channel.kind}
                  message={channel.kind}
                  variant={index === 0 ? "primary" : "secondary"}
                  icon={CHANNEL_ICONS[channel.kind]}
                >
                  <span className="sr-only">{channel.detail}: </span>
                  {channel.kind === "email" ? <EmailLabel address={channel.label} /> : channel.label}
                </DemoButton>
              ))}
            </div>

            <p className="mt-6 text-small text-fg-muted">{card.stages}</p>
            <p className="mt-3 flex items-start gap-2 border-t border-dashed border-line-strong pt-3 text-micro text-fg-muted">
              <Flask size={14} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
              {card.demoNote}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
