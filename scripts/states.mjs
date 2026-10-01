// Drives every interactive state at 1440, 390 and 320px, saves screenshots
// and asserts behaviour. Usage: BASE_URL=http://localhost:3000 node scripts/states.mjs [outDir]
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
  // Fixed bars would otherwise overlay tall elements in stitched captures.
  const hide = (v) =>
    page.evaluate((visibility) => {
      for (const el of document.querySelectorAll("header.sticky, .cta-bar")) el.style.visibility = visibility;
    }, v);
  await hide("hidden");
  await locator.screenshot({ path });
  await hide("");
}

const active = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, id: el?.id, text: (el?.textContent ?? "").trim().slice(0, 80), label: el?.getAttribute("aria-label") };
  });

// ------------------------------------------------------------- Review fixes
async function reviewChecks(page, w) {
  check(`[${w}] Logo link is named "Straiton home"`, (await page.getByRole("link", { name: "Straiton home", exact: true }).count()) === 1);

  const bankButtons = await page.locator('button[aria-haspopup="dialog"]').evaluateAll((els) =>
    els.map((el) => el.textContent.replace(/\s+/g, " ").trim()),
  );
  const allowed = ["Already have a bank quote? Send it to us", "Send it to us"];
  if (w <= 390) {
    // On phones the label may wrap, but only at the question mark.
    const lines = await page
      .locator("#top")
      .getByRole("button", { name: allowed[0] })
      .evaluate((el) => {
        const spans = el.querySelectorAll("span.whitespace-nowrap");
        return spans.length === 2 && spans[0].getBoundingClientRect().top !== spans[1].getBoundingClientRect().top ? "two lines, split at the question" : spans.length === 2 ? "one line" : "unexpected";
      });
    check(`[${w}] Hero bank-quote label breaks only at the question mark`, lines !== "unexpected", lines);
  }
  check(
    `[${w}] Each bank-quote button has one label`,
    bankButtons.length > 0 && bankButtons.every((t) => allowed.includes(t)),
    bankButtons.join(" | "),
  );
  for (const label of allowed) {
    const count = bankButtons.filter((t) => t === label).length;
    if (!count) continue;
    check(
      `[${w}] Accessible name matches visible text: "${label}"`,
      (await page.getByRole("button", { name: label, exact: true, includeHidden: true }).count()) === count,
    );
  }

  const stepExposed = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.getElementById("assessment"), NodeFilter.SHOW_TEXT);
    let n = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.includes("Step 1 of 2") && !node.parentElement.closest('[aria-hidden="true"]')) n++;
    }
    return n;
  });
  check(`[${w}] "Step 1 of 2" is exposed to assistive tech once`, stepExposed === 1, `${stepExposed}`);

  const placeholder = await page.locator("#af-paymentType option").first().textContent();
  check(`[${w}] Select placeholder has no asterisk`, placeholder === "Select a payment type", placeholder);
  const typeLabel = await page.locator('label[for="af-paymentType"]').textContent();
  check(`[${w}] Payment type label is marked required`, /\(required\)/.test(typeLabel), typeLabel);
  check(`[${w}] No asterisks in form labels`, !(await page.locator("#assessment").textContent()).includes("*"));

  const guides = page.locator("#faq button", { hasText: "How to pay a supplier in India from the UAE" });
  check(`[${w}] Guides list is rendered once`, (await guides.count()) === 1);
  check(`[${w}] Guides list is visible`, await guides.isVisible());
  await guides.click();
  check(`[${w}] Clicking a guide shows the demo toast`, await page.getByText("Guides aren't part of this demo").first().isVisible());

  for (const label of ["Privacy", "Terms"]) {
    const btn = page.locator("footer button", { hasText: label });
    check(`[${w}] Footer ${label} is tagged Demo`, /Demo/.test(await btn.textContent()));
    await btn.click();
    check(`[${w}] Footer ${label} shows the demo toast`, await page.getByText("Legal pages aren't part of this demo").first().isVisible());
  }
  await dismissToasts(page);
}

// ------------------------------------------------------- Mobile polish checks
async function layoutChecks(page, w) {
  const header = await page.evaluate(() => {
    const el = document.querySelector("header.sticky");
    return { bg: getComputedStyle(el).backgroundColor, height: Math.round(el.getBoundingClientRect().height) };
  });
  const alpha = header.bg.startsWith("rgba") ? Number(header.bg.split(",")[3]) : 1;
  check(`[${w}] Sticky header background is opaque`, alpha === 1, header.bg);

  // Anchored sections stop exactly below the header.
  for (const id of ["quote", "faq"]) {
    await page.evaluate((target) => document.getElementById(target).scrollIntoView({ block: "start" }), id);
    await page.waitForTimeout(150);
    const top = await page.evaluate((target) => Math.round(document.getElementById(target).getBoundingClientRect().top), id);
    check(`[${w}] #${id} lands directly under the header`, Math.abs(top - header.height) <= 1, `top ${top}px, header ${header.height}px`);
  }

  if (w < 640) {
    const order = await page.evaluate(() => {
      const card = document.getElementById("assessment").getBoundingClientRect();
      const lead = document.querySelector("#top p.text-lead").getBoundingClientRect();
      const bank = document.querySelector('#top button[aria-haspopup="dialog"]').getBoundingClientRect();
      return { leadThenForm: lead.bottom <= card.top, formThenButton: card.bottom <= bank.top };
    });
    check(`[${w}] Hero order: lead, form, then bank-quote button`, order.leadThenForm && order.formThenButton, JSON.stringify(order));

    const support = await page.evaluate(() => {
      const card = document.querySelector("#support .rounded-frame");
      const title = card.querySelector("h3").getBoundingClientRect();
      const pill = [...card.querySelectorAll("span")].find((s) => s.textContent.trim() === "Demo" && s.className.includes("rounded-pill")).getBoundingClientRect();
      const titleLines = Math.round(title.height / parseFloat(getComputedStyle(card.querySelector("h3")).lineHeight));
      const email = [...card.querySelectorAll("button span.whitespace-nowrap")].map((s) => s.getClientRects().length);
      return { pillBelowTitle: pill.top >= title.bottom - 1, titleLines, emailSegmentsUnbroken: email.length === 2 && email.every((n) => n === 1) };
    });
    check(`[${w}] Support Demo pill sits on its own line under the title`, support.pillBelowTitle);
    check(`[${w}] "India payments manager" fits on 1 to 2 lines`, support.titleLines <= 2, `${support.titleLines} lines`);
    check(`[${w}] Support email never breaks mid-word`, support.emailSegmentsUnbroken);

    // Compact means no empty space: each row is as tall as its content plus padding.
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll("#corridor .grid > div.rounded-card.border")].map((el) => {
        const s = getComputedStyle(el);
        const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom) + parseFloat(s.borderTopWidth) + parseFloat(s.borderBottomWidth);
        const content = Math.max(el.firstElementChild.getBoundingClientRect().height, el.lastElementChild.getBoundingClientRect().height);
        const iconLeft = el.firstElementChild.getBoundingClientRect().right <= el.lastElementChild.getBoundingClientRect().left;
        return { height: Math.round(el.getBoundingClientRect().height), slack: Math.round(el.getBoundingClientRect().height - content - pad), iconLeft };
      }),
    );
    const maxSlack = Math.max(...rows.map((r) => r.slack));
    check(
      `[${w}] Corridor facts are compact rows (icon left, no empty space)`,
      rows.every((r) => r.iconLeft) && maxSlack <= 1,
      `row heights ${rows.map((r) => r.height).join("/")}px, max slack ${maxSlack}px`,
    );
  }
}

async function dismissToasts(page) {
  const buttons = page.getByRole("button", { name: "Dismiss notification" });
  while ((await buttons.count()) > 0) await buttons.first().click();
}

// ---------------------------------------------------------------- Form flow
async function formFlow(page, tag) {
  const card = page.locator("#assessment");
  await card.scrollIntoViewIfNeeded();
  await shotEl(page, card, `${out}/${tag}-form-1-default.png`);

  await card.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(100);
  const a1 = await active(page);
  check(`[${tag}] Empty step 1 focuses the error summary`, /things to fix/.test(a1.text), a1.text);
  check(`[${tag}] Inline error shown for amount`, await card.getByText("Enter the payment amount").first().isVisible());
  await shotEl(page, card, `${out}/${tag}-form-2-step1-errors.png`);

  await page.fill("#af-amount", "250000");
  await page.locator("#af-amount").blur();
  check(`[${tag}] Amount is formatted on blur`, (await page.inputValue("#af-amount")) === "250,000");
  await page.selectOption("#af-paymentType", "supplier");
  await page.click("label:has(#af-currency-USD)");
  check(`[${tag}] Prefix follows the currency choice`, (await card.locator("span[aria-hidden='true']", { hasText: "USD" }).count()) > 0);
  await page.click("label:has(#af-currency)");
  await card.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(100);
  check(`[${tag}] Continue moves focus to the step 2 heading`, /Your details/.test((await active(page)).text));
  await shotEl(page, card, `${out}/${tag}-form-3-step2.png`);

  await page.fill("#af-email", "finance@alnoor");
  await card.getByRole("button", { name: "Request an assessment" }).click();
  await page.waitForTimeout(100);
  check(`[${tag}] Step 2 lists three problems`, (await card.getByText("There are 3 things to fix").count()) === 1);
  await shotEl(page, card, `${out}/${tag}-form-4-step2-errors.png`);

  await card.getByRole("link", { name: "Enter your company name" }).click();
  check(`[${tag}] Summary link focuses its field`, (await active(page)).id === "af-company");

  await page.fill("#af-company", "Al Noor Trading LLC");
  await page.fill("#af-name", "Mariam Haddad");
  await page.fill("#af-email", "mariam@alnoor.ae");
  await page.fill("#af-phone", "+971 50 000 0000");
  check(`[${tag}] Errors clear live once fixed`, (await card.getByText("things to fix").count()) === 0);
  await card.getByRole("button", { name: "Request an assessment" }).click();
  await page.waitForTimeout(150);
  check(`[${tag}] Loading state shows`, await card.getByText("Sending request").first().isVisible());
  await shotEl(page, card, `${out}/${tag}-form-5-loading.png`);
  await card.getByText("Demo only. No data was sent.").waitFor();
  await page.waitForTimeout(100);
  check(`[${tag}] Success heading receives focus`, /Here's what happens next/.test((await active(page)).text));
  const summary = await card.locator("dl").evaluate((dl) => {
    const dts = [...dl.querySelectorAll("dt")];
    const dds = [...dl.querySelectorAll("dd")];
    return {
      truncated: dds.some((dd) => dd.scrollWidth > dd.clientWidth + 1),
      stacked: dts.every((dt, i) => dt.getBoundingClientRect().bottom <= dds[i].getBoundingClientRect().top + 1),
    };
  });
  check(`[${tag}] Confirmation summary values are not truncated`, !summary.truncated);
  if (tag.startsWith("mobile")) check(`[${tag}] Confirmation summary stacks label above value`, summary.stacked);
  await shotEl(page, card, `${out}/${tag}-form-6-success.png`);
  await card.getByRole("button", { name: "Start a new request" }).click();
  check(`[${tag}] Reset returns to an empty step 1`, (await page.inputValue("#af-amount")) === "");
}

// ----------------------------------------------------------- Dialog flow
async function dialogFlow(page, tag, trigger) {
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator("dialog[open]");
  await dialog.waitFor();
  check(`[${tag}] Bank-quote dialog opens as a modal`, (await dialog.count()) === 1);
  check(`[${tag}] Page scroll is locked`, (await page.evaluate(() => document.documentElement.style.overflow)) === "hidden");
  await page.screenshot({ path: `${out}/${tag}-dialog-1-open.png` });
  await dialog.getByRole("button", { name: "Send quote" }).click();
  await page.waitForTimeout(100);
  check(`[${tag}] Dialog errors focus the summary`, /things to fix/.test((await active(page)).text));
  await page.screenshot({ path: `${out}/${tag}-dialog-2-errors.png` });
  await page.setInputFiles("#bq-file", { name: "bank-quote.txt", mimeType: "text/plain", buffer: Buffer.from("demo") });
  check(`[${tag}] Wrong file type is rejected`, await dialog.getByText("The file must be a PDF, PNG or JPG").first().isVisible());
  await page.setInputFiles("#bq-file", { name: "bank-quote-march.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 demo") });
  await page.fill("#bq-name", "Mariam Haddad");
  await page.fill("#bq-company", "Al Noor Trading LLC");
  await page.fill("#bq-email", "mariam@alnoor.ae");
  await page.screenshot({ path: `${out}/${tag}-dialog-3-filled.png` });
  await dialog.getByRole("button", { name: "Send quote" }).click();
  await dialog.getByText("Demo only. No data was sent.").waitFor();
  await page.screenshot({ path: `${out}/${tag}-dialog-4-success.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  check(`[${tag}] Esc closes the dialog`, (await page.locator("dialog[open]").count()) === 0);
  check(`[${tag}] Focus returns to the trigger`, /Send it to us/.test((await active(page)).text), (await active(page)).text);
}

const browser = await chromium.launch();

// ---------------------------------------------------------------- Desktop
{
  const tag = "desktop1440";
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/${tag}-01-hero.png` });

  await reviewChecks(page, 1440);
  await layoutChecks(page, 1440);
  await formFlow(page, tag);
  await dialogFlow(page, tag, page.locator("#top").getByRole("button", { name: /bank quote/i }));

  await page.getByRole("banner").getByRole("button", { name: /Sign in/ }).click();
  await page.getByText("Sign in isn't part of this demo").waitFor();
  await page.screenshot({ path: `${out}/${tag}-02-toast.png` });

  const how = page.locator("#how-it-works");
  await how.scrollIntoViewIfNeeded();
  await how.getByRole("tab", { name: /Assess/ }).click();
  check("Assess tab selected", (await how.getByRole("tab", { name: /Assess/ }).getAttribute("aria-selected")) === "true");
  await page.keyboard.press("ArrowRight");
  check("ArrowRight moves to Complete", (await how.getByRole("tab", { name: /Complete/ }).getAttribute("aria-selected")) === "true");
  await page.keyboard.press("End");
  check("End moves to Track", (await how.getByRole("tab", { name: /Track/ }).getAttribute("aria-selected")) === "true");
  await how.getByRole("tab", { name: /Assess/ }).click();
  await shotEl(page, how, `${out}/${tag}-03-how-it-works.png`);

  const faqSection = page.locator("#faq");
  const first = faqSection.getByRole("button", { name: "Who can use the India pilot?" });
  await first.focus();
  await page.keyboard.press("Enter");
  check("Enter expands an FAQ item", (await first.getAttribute("aria-expanded")) === "true");
  await page.keyboard.press("ArrowDown");
  check("ArrowDown moves to the next question", /same-day/.test((await active(page)).text));
  check(
    "Same-day answer is open by default",
    (await faqSection.getByRole("button", { name: "Do you guarantee same-day execution?" }).getAttribute("aria-expanded")) === "true",
  );
  await shotEl(page, faqSection, `${out}/${tag}-04-faq.png`);

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Support" }).click();
  await page.waitForTimeout(400);
  check(
    "Nav marks the current section",
    (await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Support" }).getAttribute("aria-current")) === "true",
  );

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

  await page.goto(base, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  check("First Tab reaches the skip link", /Skip to main content/.test((await active(page)).text));
  await page.screenshot({ path: `${out}/${tag}-05-skip-link.png`, clip: { x: 0, y: 0, width: 600, height: 120 } });
  await ctx.close();
}

// ---------------------------------------------------------------- Mobile
for (const width of [390, 320]) {
  const tag = `mobile${width}`;
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
  await page.screenshot({ path: `${out}/${tag}-01-hero.png` });

  const bar = page.locator(".cta-bar");
  check(`[${width}] Sticky CTA hidden at the top`, (await bar.getAttribute("data-visible")) === "false");

  // Menu
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.locator("#mobile-menu[open]");
  await menu.waitFor();
  check(`[${width}] Menu opens`, (await menu.count()) === 1);
  check(`[${width}] Menu locks scroll`, (await page.evaluate(() => document.documentElement.style.overflow)) === "hidden");
  await page.screenshot({ path: `${out}/${tag}-02-menu-open.png` });
  let escaped = false;
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    if (!(await page.evaluate(() => !!document.activeElement?.closest("#mobile-menu")))) escaped = true;
  }
  check(`[${width}] Tab stays inside the menu`, !escaped);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  check(`[${width}] Esc closes the menu`, (await page.locator("#mobile-menu[open]").count()) === 0);
  check(`[${width}] Focus returns to the menu button`, (await active(page)).label === "Open menu");

  await reviewChecks(page, width);
  await layoutChecks(page, width);

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
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  await bar.getByRole("link", { name: "Request an assessment" }).click();
  await page.waitForTimeout(500);
  check(`[${width}] Sticky CTA hides when the form is on screen`, (await bar.getAttribute("data-visible")) === "false");
  check(`[${width}] Sticky CTA moves focus to the form`, (await active(page)).id === "assessment-title");

  await formFlow(page, tag);
  await dialogFlow(page, tag, page.locator("#top").getByRole("button", { name: /bank quote/i }));

  // Tabs 2x2
  const how = page.locator("#how-it-works");
  await how.scrollIntoViewIfNeeded();
  await how.getByRole("tab", { name: /Assess/ }).click();
  await shotEl(page, how, `${out}/${tag}-04-how-it-works.png`);
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
