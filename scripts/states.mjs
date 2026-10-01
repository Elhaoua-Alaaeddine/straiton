// Drives every interactive state, saves screenshots and checks behaviour.
// Usage: BASE_URL=http://localhost:3000 node scripts/states.mjs [outDir]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.argv[2] ?? "screenshots/states";
mkdirSync(out, { recursive: true });

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}
async function shotEl(page, locator, path) {
  // The sticky header would otherwise overlay tall elements in stitched captures.
  await page.evaluate(() => document.querySelector("header")?.style.setProperty("visibility", "hidden"));
  await locator.screenshot({ path });
  await page.evaluate(() => document.querySelector("header")?.style.removeProperty("visibility"));
}
const active = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, id: el?.id, text: (el?.textContent ?? "").trim().slice(0, 80), label: el?.getAttribute("aria-label") };
  });

const browser = await chromium.launch();

// ---------------------------------------------------------------- Desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/desktop-01-hero.png` });

  const card = page.locator("#assessment");

  // Step 1 errors
  await card.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(100);
  const a1 = await active(page);
  check("Step 1 submit with empty fields focuses the error summary", /things to fix/.test(a1.text), a1.text);
  check("Inline error shown for amount", await card.getByText("Enter the payment amount").first().isVisible());
  await shotEl(page, card, `${out}/desktop-02-form-step1-errors.png`);

  // Live re-validation and amount formatting
  await page.fill("#af-amount", "250000");
  await page.locator("#af-amount").blur();
  check("Amount is formatted on blur", (await page.inputValue("#af-amount")) === "250,000", await page.inputValue("#af-amount"));
  await page.selectOption("#af-paymentType", "supplier");
  await page.click("label:has(#af-currency-USD)");
  check("Prefix follows the currency choice", (await card.locator("span[aria-hidden='true']", { hasText: "USD" }).count()) > 0);
  await page.click("label:has(#af-currency)");
  await card.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(100);
  const a2 = await active(page);
  check("Continue moves focus to the step 2 heading", /Your details/.test(a2.text), a2.text);
  await shotEl(page, card, `${out}/desktop-03-form-step2.png`);

  // Step 2 errors
  await page.fill("#af-email", "finance@alnoor");
  await card.getByRole("button", { name: "Request an assessment" }).click();
  await page.waitForTimeout(100);
  check("Step 2 lists three problems", (await card.getByText("There are 3 things to fix").count()) === 1);
  check("Email format message", await card.getByText("Enter an email address like name@company.ae").first().isVisible());
  await shotEl(page, card, `${out}/desktop-04-form-step2-errors.png`);

  // Error summary link focuses its field
  await card.getByRole("link", { name: "Enter your company name" }).click();
  check("Summary link focuses the field", (await active(page)).id === "af-company");

  // Valid submit, loading, success
  await page.fill("#af-company", "Al Noor Trading LLC");
  await page.fill("#af-name", "Mariam Haddad");
  await page.fill("#af-email", "mariam@alnoor.ae");
  await page.fill("#af-phone", "+971 50 000 0000");
  check("Errors clear live once fixed", (await card.getByText("things to fix").count()) === 0);
  await card.getByRole("button", { name: "Request an assessment" }).click();
  await page.waitForTimeout(150);
  check("Loading state shows", await card.getByText("Sending request").first().isVisible());
  await shotEl(page, card, `${out}/desktop-05-form-loading.png`);
  await card.getByText("Demo only. No data was sent.").waitFor();
  await page.waitForTimeout(100);
  check("Success heading receives focus", /Here's what happens next/.test((await active(page)).text));
  await shotEl(page, card, `${out}/desktop-06-form-success.png`);
  await card.getByRole("button", { name: "Start a new request" }).click();
  check("Reset returns to step 1 with empty amount", (await page.inputValue("#af-amount")) === "");

  // Bank quote dialog
  await page.locator("#top").getByRole("button", { name: /bank quote/i }).click();
  const dialog = page.locator("dialog[open]");
  await dialog.waitFor();
  check("Dialog opens as a modal", (await dialog.count()) === 1);
  check("Page scroll is locked", (await page.evaluate(() => document.documentElement.style.overflow)) === "hidden");
  await page.screenshot({ path: `${out}/desktop-07-bankquote-open.png` });
  await dialog.getByRole("button", { name: "Send quote" }).click();
  await page.waitForTimeout(100);
  check("Bank quote errors focus the summary", /things to fix/.test((await active(page)).text));
  await page.screenshot({ path: `${out}/desktop-08-bankquote-errors.png` });
  await page.setInputFiles("#bq-file", { name: "bank-quote.txt", mimeType: "text/plain", buffer: Buffer.from("demo") });
  check("Wrong file type is rejected", await dialog.getByText("The file must be a PDF, PNG or JPG").first().isVisible());
  await page.setInputFiles("#bq-file", { name: "bank-quote-march.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 demo") });
  await page.fill("#bq-name", "Mariam Haddad");
  await page.fill("#bq-company", "Al Noor Trading LLC");
  await page.fill("#bq-email", "mariam@alnoor.ae");
  await page.screenshot({ path: `${out}/desktop-09-bankquote-filled.png` });
  await dialog.getByRole("button", { name: "Send quote" }).click();
  await dialog.getByText("Demo only. No data was sent.").waitFor();
  await page.screenshot({ path: `${out}/desktop-10-bankquote-success.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  check("Esc closes the dialog", (await page.locator("dialog[open]").count()) === 0);
  check("Focus returns to the trigger", /bank quote/i.test((await active(page)).text), (await active(page)).text);

  // Toast for demo-only controls
  await page.getByRole("banner").getByRole("button", { name: /Sign in/ }).click();
  await page.getByText("Sign in isn't part of this demo").waitFor();
  await page.screenshot({ path: `${out}/desktop-11-toast.png` });

  // Tabs: click and keyboard
  const how = page.locator("#how-it-works");
  await how.scrollIntoViewIfNeeded();
  await how.getByRole("tab", { name: /Assess/ }).click();
  check("Assess tab selected", (await how.getByRole("tab", { name: /Assess/ }).getAttribute("aria-selected")) === "true");
  await page.keyboard.press("ArrowRight");
  check("ArrowRight moves to Complete", (await how.getByRole("tab", { name: /Complete/ }).getAttribute("aria-selected")) === "true");
  await page.keyboard.press("End");
  check("End moves to Track", (await how.getByRole("tab", { name: /Track/ }).getAttribute("aria-selected")) === "true");
  await how.getByRole("tab", { name: /Assess/ }).click();
  await shotEl(page, how, `${out}/desktop-12-how-it-works-assess.png`);

  // Accordion keyboard
  const faqSection = page.locator("#faq");
  const first = faqSection.getByRole("button", { name: "Who can use the India pilot?" });
  await first.focus();
  await page.keyboard.press("Enter");
  check("Enter expands an FAQ item", (await first.getAttribute("aria-expanded")) === "true");
  await page.keyboard.press("ArrowDown");
  check("ArrowDown moves to the next question", /same-day/.test((await active(page)).text));
  const sameDay = faqSection.getByRole("button", { name: "Do you guarantee same-day execution?" });
  check("Same-day answer is open by default", (await sameDay.getAttribute("aria-expanded")) === "true");
  await shotEl(page, faqSection, `${out}/desktop-13-faq.png`);

  // Nav anchor + active state
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Support" }).click();
  await page.waitForTimeout(400);
  check(
    "Nav marks the current section",
    (await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Support" }).getAttribute("aria-current")) === "true",
  );

  // Every in-page link points at something that exists
  const missing = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="#"]'))
      .map((a) => a.getAttribute("href"))
      .filter((h) => h !== "#top" && !document.querySelector(h)),
  );
  check("No dead in-page links", missing.length === 0, missing.join(", "));
  const external = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]"))
      .map((a) => a.getAttribute("href"))
      .filter((h) => !h.startsWith("#") && h !== "/"),
  );
  check("No links leave the page", external.length === 0, external.join(", "));

  // Skip link
  await page.goto(base, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const skip = await active(page);
  check("First Tab reaches the skip link", /Skip to main content/.test(skip.text));
  await page.screenshot({ path: `${out}/desktop-14-skip-link.png`, clip: { x: 0, y: 0, width: 600, height: 120 } });
  await ctx.close();
}

// ---------------------------------------------------------------- Mobile
for (const width of [390, 320]) {
  const ctx = await browser.newContext({
    viewport: { width, height: width === 320 ? 640 : 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const tag = `mobile${width}`;
  await page.screenshot({ path: `${out}/${tag}-01-hero.png` });

  const bar = page.locator(".cta-bar");
  check(`[${width}] Sticky CTA hidden at the top`, (await bar.getAttribute("data-visible")) === "false");

  // Menu
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.locator("#mobile-menu[open]");
  await menu.waitFor();
  check(`[${width}] Menu opens`, (await menu.count()) === 1);
  check(`[${width}] Menu locks scroll`, (await page.evaluate(() => document.documentElement.style.overflow)) === "hidden");
  await page.screenshot({ path: `${out}/${tag}-02-menu.png` });
  let escaped = false;
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest("#mobile-menu"));
    if (!inside) escaped = true;
  }
  check(`[${width}] Tab stays inside the menu`, !escaped);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  check(`[${width}] Esc closes the menu`, (await page.locator("#mobile-menu[open]").count()) === 0);
  check(`[${width}] Focus returns to the menu button`, (await active(page)).label === "Open menu");

  // Sticky CTA behaviour
  await page.evaluate(() => {
    const form = document.getElementById("assessment");
    window.scrollTo(0, form.getBoundingClientRect().bottom + window.scrollY + 400);
  });
  await page.waitForTimeout(300);
  check(`[${width}] Sticky CTA appears once the form is out of view`, (await bar.getAttribute("data-visible")) === "true");
  await page.screenshot({ path: `${out}/${tag}-03-sticky-cta.png` });
  await page.locator("#quote").getByRole("button", { name: "Send it to us" }).click();
  await page.locator("dialog[open]").waitFor();
  await page.waitForTimeout(100);
  check(`[${width}] Sticky CTA hides while a dialog is open`, (await bar.getAttribute("data-visible")) === "false");
  await page.screenshot({ path: `${out}/${tag}-04-bankquote-sheet.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  await bar.getByRole("link", { name: "Request an assessment" }).click();
  await page.waitForTimeout(500);
  check(`[${width}] Sticky CTA hides when the form is on screen`, (await bar.getAttribute("data-visible")) === "false");
  check(`[${width}] Sticky CTA moves focus to the form`, (await active(page)).id === "assessment-title");

  // Form on mobile
  const card = page.locator("#assessment");
  await card.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(100);
  await shotEl(page, card, `${out}/${tag}-05-form-errors.png`);

  // Tabs 2x2
  const how = page.locator("#how-it-works");
  await how.scrollIntoViewIfNeeded();
  await how.getByRole("tab", { name: /Assess/ }).click();
  await shotEl(page, how, `${out}/${tag}-06-how-it-works.png`);
  const tabRows = await how.getByRole("tab").evaluateAll((tabs) => new Set(tabs.map((t) => Math.round(t.getBoundingClientRect().top))).size);
  check(`[${width}] Stage tabs sit in two rows`, tabRows === 2, `${tabRows} rows`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`[${width}] No horizontal page overflow`, overflow <= 0, `${overflow}px`);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exit(1);
