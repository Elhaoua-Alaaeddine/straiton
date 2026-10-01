"use client";

import { useEffect, useRef, useState } from "react";
import { List } from "@phosphor-icons/react/ssr";
import { nav } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { AssessmentButton, DemoAction } from "@/components/actions";
import { useUi } from "@/components/UiProvider";
import { MobileMenu } from "./MobileMenu";

/** Highlights the nav link for the section crossing the middle of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = nav.map((item) => item.href.slice(1));

export function Header() {
  const { menuOpen, setMenuOpen } = useUi();
  const menuButton = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(SECTION_IDS);

  return (
    <>
      <header className="sticky top-0 z-(--z-header) border-b border-line bg-canvas">
        <Container className="flex h-(--header-h) items-center gap-4">
          <a href="#top" className="-m-1 shrink-0 rounded-control p-1" aria-label="Straiton home">
            <Logo decorative />
          </a>

          <nav aria-label="Primary" className="ml-6 hidden lg:block xl:ml-10">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative flex min-h-11 items-center rounded-control px-3 text-small font-medium transition-colors duration-200",
                        isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 bottom-1.5 h-0.5 rounded-pill bg-action transition-opacity duration-200",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Wrappers own the responsive visibility so it never fights the button's own display class. */}
            <div className="hidden xl:block">
              <DemoAction message="signIn" className="text-small">
                Sign in
              </DemoAction>
            </div>
            <div className="hidden md:block">
              <AssessmentButton size="sm" withIcon={false} />
            </div>
            <button
              ref={menuButton}
              type="button"
              className="-mr-2 flex size-11 items-center justify-center rounded-control text-fg transition-colors is-hover:bg-surface-tint lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <List size={24} aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId={active} />
    </>
  );
}
