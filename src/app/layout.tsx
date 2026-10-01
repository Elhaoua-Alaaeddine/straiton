import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { meta } from "@/content/site";
import { UiProvider } from "@/components/UiProvider";
import { RevealObserver } from "@/components/RevealObserver";
import "./globals.css";

// Instrument Sans variable (weight 400-700, width 75-100), self-hosted. OFL licensed.
const instrument = localFont({
  src: "./fonts/InstrumentSans-Variable.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  // A design prototype for a fictional brief: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfcfc",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={instrument.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JavaScript is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-(--z-toast) rounded-control bg-action px-4 py-3 font-semibold text-action-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <UiProvider>{children}</UiProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
