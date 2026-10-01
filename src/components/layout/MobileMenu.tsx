"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowUpRight, X } from "@phosphor-icons/react/ssr";
import { ctas, nav } from "@/content/site";
import { prefersReducedMotion, useFocusTrap, useScrollLock } from "@/lib/a11y";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { AssessmentButton, BankQuoteButton, DemoAction } from "@/components/actions";

/**
 * Full-screen menu on a native modal <dialog>: page behind is inert, Esc
 * closes it, Tab is trapped, page scroll is locked, and focus returns to the
 * menu button on close.
 */
export function MobileMenu({ open, onClose, activeId }: { open: boolean; onClose: () => void; activeId: string | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      returnFocus.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // Close if the viewport grows past the breakpoint where the full nav shows.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => query.matches && onClose();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, onClose]);

  function goTo(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    onClose();
    // Let the dialog close and release the scroll lock, then scroll.
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      const heading = target.querySelector<HTMLElement>("h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
      window.history.replaceState(null, "", href);
    });
  }

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-label="Menu"
      className="st-dialog lg:hidden"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div ref={panelRef} className="st-dialog-panel flex h-full flex-col overflow-y-auto bg-canvas">
        <Container className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-line">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 flex size-11 items-center justify-center rounded-control text-fg transition-colors is-hover:bg-surface-tint"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </Container>

        <Container className="flex flex-1 flex-col pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <nav aria-label="Menu">
            <ul className="flex flex-col">
              {nav.map((item) => {
                const isActive = activeId === item.href.slice(1);
                return (
                  <li key={item.href} className="border-b border-line">
                    <a
                      href={item.href}
                      onClick={(event) => goTo(event, item.href)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex min-h-14 items-center justify-between py-3 text-h3 font-semibold tracking-tight transition-colors",
                        isActive ? "text-accent" : "text-fg hover:text-accent",
                      )}
                    >
                      {item.label}
                      <ArrowUpRight size={20} className="rotate-90 text-fg-subtle" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-10">
            <AssessmentButton size="lg" fullWidth />
            <BankQuoteButton size="lg" fullWidth />
            <a
              href={ctas.manager.href}
              onClick={(event) => goTo(event, ctas.manager.href)}
              className="flex min-h-12 items-center justify-center font-semibold text-accent underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-current"
            >
              {ctas.manager.label}
            </a>
            <div className="flex justify-center border-t border-line pt-3">
              <DemoAction message="signIn" onBeforeToast={onClose}>
                Sign in
              </DemoAction>
            </div>
          </div>
        </Container>
      </div>
    </dialog>
  );
}
