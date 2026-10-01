import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Quote } from "@/components/sections/Quote";
import { Corridor } from "@/components/sections/Corridor";
import { Readiness } from "@/components/sections/Readiness";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Support } from "@/components/sections/Support";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * Narrative: problem-led promise and form, who the pilot is for, the three
 * pains, the quote, the corridor facts, preparation, the four stages, the
 * person behind it, honest answers, and a final prompt to act.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Problem />
        <Quote />
        <Corridor />
        <Readiness />
        <HowItWorks />
        <Support />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
