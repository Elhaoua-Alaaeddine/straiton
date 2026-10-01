// Verifies every text and UI colour pairing used by the design system against
// WCAG 2.2 AA. Reads tokens straight from src/app/globals.css so the check can
// never drift from the source of truth. Run with: npm run check:contrast
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function block(startPattern) {
  const start = css.search(startPattern);
  if (start < 0) throw new Error(`Block not found: ${startPattern}`);
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(start, i);
  }
  throw new Error("Unclosed block");
}

function readVars(src) {
  const vars = {};
  for (const m of src.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
    if (m[2].trim() !== "initial") vars[m[1]] = m[2].trim();
  }
  return vars;
}

const light = readVars(block(/@theme(\s+static)?\s*\{/));
const navy = { ...light, ...readVars(block(/@utility surface-navy\s*\{/)) };

function channels(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT = 4.5;
const UI = 3;

// [foreground, background, minimum, what it is]
const pairs = [
  ["fg", "canvas", TEXT, "Body text on page"],
  ["fg", "surface", TEXT, "Body text on cards"],
  ["fg", "surface-tint", TEXT, "Body text on tinted sections"],
  ["fg", "surface-sunken", TEXT, "Body text on sunken panels"],
  ["fg-muted", "canvas", TEXT, "Secondary text on page"],
  ["fg-muted", "surface", TEXT, "Secondary text on cards"],
  ["fg-muted", "surface-tint", TEXT, "Secondary text on tinted sections"],
  ["fg-muted", "surface-sunken", TEXT, "Secondary text on sunken panels"],
  ["fg-subtle", "canvas", TEXT, "Captions and placeholders on page"],
  ["fg-subtle", "surface", TEXT, "Captions and placeholders on cards"],
  ["accent", "canvas", TEXT, "Links and accent text on page"],
  ["accent", "surface", TEXT, "Links and accent text on cards"],
  ["accent", "surface-tint", TEXT, "Links on tinted sections"],
  ["accent", "accent-soft", TEXT, "Accent badge text"],
  ["fg", "accent-soft", TEXT, "Selected choice card label"],
  ["fg-muted", "accent-soft", TEXT, "Selected choice card detail"],
  ["action-fg", "action", TEXT, "Primary button label"],
  ["action-fg", "action-hover", TEXT, "Primary button label, hover"],
  ["action-fg", "action-active", TEXT, "Primary button label, pressed"],
  ["action", "canvas", UI, "Primary button edge against page"],
  ["action", "surface", UI, "Primary button edge against cards"],
  ["focus", "canvas", UI, "Focus ring on page"],
  ["focus", "surface", UI, "Focus ring on cards"],
  ["focus", "surface-tint", UI, "Focus ring on tinted sections"],
  ["line-strong", "canvas", UI, "Form field border on page"],
  ["line-strong", "surface", UI, "Form field border on cards"],
  ["pending-fg", "pending-bg", TEXT, "To be confirmed badge"],
  ["danger-fg", "danger-bg", TEXT, "Error summary text"],
  ["danger-fg", "surface", TEXT, "Inline error text on cards"],
  ["danger-fg", "canvas", TEXT, "Inline error text on page"],
  ["danger-line", "surface", UI, "Error field border"],
  ["success-fg", "success-bg", TEXT, "Success badge"],
];

const navyOnly = [
  ["fg-muted", "surface-sunken", TEXT, "Footer secondary text"],
  ["fg-subtle", "surface-sunken", TEXT, "Footer captions"],
  ["fg-subtle", "surface", TEXT, "Captions on navy cards"],
];

function hex(scope, token) {
  let value = scope[token];
  const seen = new Set();
  while (value && value.startsWith("var(")) {
    const name = value.match(/--color-([a-z0-9-]+)/)[1];
    if (seen.has(name)) throw new Error(`Circular token: ${name}`);
    seen.add(name);
    value = light[name];
  }
  if (!value || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Cannot resolve ${token}: ${value}`);
  return value;
}

let failures = 0;
function run(label, scope, list) {
  console.log(`\n${label}`);
  for (const [fg, bg, min, what] of list) {
    const r = ratio(hex(scope, fg), hex(scope, bg));
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)} : 1  (min ${min})  ${fg} on ${bg}  ${hex(scope, fg)} / ${hex(scope, bg)}  ${what}`,
    );
  }
}

run("Light surfaces", light, pairs);
run("Navy surfaces (surface-navy)", navy, [...pairs, ...navyOnly]);

if (failures) {
  console.error(`\n${failures} pairing(s) below WCAG AA.`);
  process.exit(1);
}
console.log("\nAll pairings meet WCAG AA.");
