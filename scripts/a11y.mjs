// axe-core audit (WCAG 2.0-2.2 A and AA) of the landing page in several states.
// Usage: BASE_URL=http://localhost:3000 node scripts/a11y.mjs
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
const browser = await chromium.launch();
let total = 0;

async function audit(label, page, include) {
  let builder = new AxeBuilder({ page }).withTags(tags);
  if (include) builder = builder.include(include);
  const { violations, passes } = await builder.analyze();
  total += violations.length;
  console.log(`\n${label}: ${violations.length} violation(s), ${passes.length} rules passed`);
  for (const v of violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 4)) console.log(`     ${node.target.join(" ")}  ${node.failureSummary?.split("\n")[1] ?? ""}`);
  }
}

for (const [width, mobile] of [
  [1440, false],
  [390, true],
]) {
  const ctx = await browser.newContext({
    viewport: { width, height: mobile ? 844 : 900 },
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await audit(`Page at ${width}px`, page);

  // Form with errors visible
  await page.locator("#assessment").getByRole("button", { name: "Continue" }).click();
  await audit(`Assessment form with errors at ${width}px`, page, "#assessment");

  // Payment type chosen: selected choice card plus the remaining error states.
  await page.locator("label:has(#af-paymentType)").click();
  await audit(`Assessment form with a payment type selected at ${width}px`, page, "#assessment");

  if (mobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu[open]").waitFor();
    await audit("Mobile menu open", page);
    await page.keyboard.press("Escape");
  }

  await page.locator("#top").getByRole("button", { name: /bank quote/i }).click();
  await page.locator("dialog[open]").waitFor();
  await page.locator("dialog[open]").getByRole("button", { name: "Send quote" }).click();
  await audit(`Bank quote dialog with errors at ${width}px`, page);
  await ctx.close();
}

await browser.close();
console.log(`\nTotal violations: ${total}`);
if (total) process.exit(1);
