"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { AssessmentButton } from "@/components/actions";
import { useUi } from "@/components/UiProvider";

/**
 * Phones only. Appears once the hero form has scrolled out of view above,
 * and hides again whenever the form, a dialog or the menu is on screen.
 */
export function MobileCtaBar() {
  const { bankQuoteOpen, menuOpen } = useUi();
  const [pastForm, setPastForm] = useState(false);

  useEffect(() => {
    const form = document.getElementById("assessment");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPastForm(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const visible = pastForm && !bankQuoteOpen && !menuOpen;

  return (
    <div
      inert={!visible}
      data-visible={visible}
      className={cn(
        "cta-bar fixed inset-x-0 bottom-0 z-(--z-sticky-cta) border-t border-line bg-canvas/95 px-gutter pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur-md md:hidden",
        "shadow-[0_-12px_32px_-16px_rgb(10_34_49/0.25)]",
      )}
    >
      <AssessmentButton size="lg" fullWidth />
    </div>
  );
}
