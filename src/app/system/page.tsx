import type { Metadata } from "next";
import { Showcase } from "./Showcase";

export const metadata: Metadata = {
  title: "Straiton design system",
  description: "Tokens and component states for the Straiton landing page.",
  robots: { index: false, follow: false },
};

export default function SystemPage() {
  return <Showcase />;
}
