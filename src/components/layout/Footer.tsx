import { EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { brand, ctas, demo, footer, nav, support } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { DemoAction } from "@/components/actions";

const linkClass =
  "inline-flex min-h-11 items-center text-small text-fg-muted transition-colors hover:text-fg sm:min-h-9";

export function Footer() {
  const [whatsapp, phone, email] = support.card.channels;
  return (
    <footer className="surface-navy">
      <div className="bg-surface-sunken pb-28 md:pb-0">
        <Container className="py-14 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="sm:col-span-2 lg:col-span-4">
              <Logo tone="dark" />
              <p className="mt-4 max-w-xs text-small text-fg-muted">{brand.tagline}</p>
            </div>

            <nav aria-labelledby="footer-page-links" className="lg:col-span-3">
              <h2 id="footer-page-links" className="text-small font-semibold text-fg">
                {footer.pageLinksTitle}
              </h2>
              <ul className="mt-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={linkClass}>
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={ctas.assessment.href} className={linkClass}>
                    {ctas.assessment.label}
                  </a>
                </li>
              </ul>
            </nav>

            <div className="lg:col-span-2">
              <h2 className="text-small font-semibold text-fg">{footer.corridorsTitle}</h2>
              <ul className="mt-3 flex flex-col gap-3">
                {footer.corridors.map((corridor, index) => (
                  <li key={corridor.label} className="flex flex-col items-start gap-1.5">
                    <span className="text-small text-fg">{corridor.label}</span>
                    <Badge variant={index === 0 ? "pending" : "neutral"} size="sm">
                      {corridor.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center gap-2">
                <h2 className="text-small font-semibold text-fg">{footer.contactTitle}</h2>
                <Badge variant="demo" size="sm">
                  {demo.label}
                </Badge>
              </div>
              <ul className="mt-3">
                <li>
                  <DemoAction message="whatsapp" variant="plain" showTag={false} className="text-small" icon={<WhatsappLogo size={16} aria-hidden="true" />}>
                    {whatsapp.detail}
                  </DemoAction>
                </li>
                <li>
                  <DemoAction message="phone" variant="plain" showTag={false} className="text-small" icon={<Phone size={16} aria-hidden="true" />}>
                    {phone.label}
                  </DemoAction>
                </li>
                <li>
                  <DemoAction message="email" variant="plain" showTag={false} className="text-small break-all" icon={<EnvelopeSimple size={16} aria-hidden="true" />}>
                    {email.label}
                  </DemoAction>
                </li>
              </ul>
            </div>
          </div>

          <section aria-labelledby="regulatory-title" className="mt-12 rounded-card border border-line p-5 sm:p-6">
            <h2 id="regulatory-title" className="text-small font-semibold text-fg">
              {footer.regulatory.title}
            </h2>
            <p className="mt-2 max-w-3xl text-small text-fg-muted">{footer.regulatory.body}</p>
          </section>

          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-micro text-fg-subtle lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <p>{footer.copyright}</p>
            <p className="lg:text-center">{footer.prototypeNote}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {footer.legal.map((label) => (
                <li key={label}>
                  <DemoAction message="legal" variant="plain" className="text-micro">
                    {label}
                  </DemoAction>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
