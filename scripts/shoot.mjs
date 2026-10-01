// Full-page screenshots of a route at several widths, with an overflow check.
// Usage: node scripts/shoot.mjs <path> <outDir> [widths=1440,390] [baseUrl]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const [, , route = "/", outDir = "screenshots", widthArg = "1440,390", base = process.env.BASE_URL ?? "http://localhost:3000"] =
  process.argv;
// Git Bash on Windows may rewrite "/system" into "C:/Program Files/Git/system".
const path = "/" + route.replace(/^.*?Git\//, "").replace(/^\/+/, "");
const widths = widthArg.split(",").map(Number);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
    deviceScaleFactor: width < 768 ? 2 : 1,
    // Phones use overlay scrollbars; emulate that so 390px means 390px of content.
    isMobile: width < 768,
    hasTouch: width < 768,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > doc.clientWidth + 1 || r.left < -1)) {
        const style = getComputedStyle(el);
        if (style.position === "fixed") continue;
        let clipped = false;
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) {
            clipped = true;
            break;
          }
        }
        if (!clipped) offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`);
      }
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders: offenders.slice(0, 8) };
  });
  const name = `${outDir}/${path === "/" ? "home" : path.replace(/\//g, "")}-${width}.png`;
  await page.screenshot({ path: name, fullPage: true });
  console.log(
    `${width}px  scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}  ${
      overflow.scrollWidth > overflow.clientWidth ? "OVERFLOW" : "no page overflow"
    }  -> ${name}`,
  );
  if (overflow.offenders.length) console.log("  elements past the viewport:\n   " + overflow.offenders.join("\n   "));
  await context.close();
}
await browser.close();
