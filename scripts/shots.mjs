// Captures every route at 390px and 1440px into /exports for a client deck.
// Assumes the dev server is already running at http://localhost:3000
// (npm run dev), or starts one itself if PORT is unreachable.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const BASE_URL = process.env.SHOTS_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("exports");

const routes = [
  ["home", "/"],
  ["our-space", "/our-space"],
  ["treatments", "/treatments"],
  ["treatment-cavity-fillings", "/treatments/cavity-fillings"],
  ["treatment-braces-clear-aligners", "/treatments/braces-clear-aligners"],
  ["treatment-dental-trauma", "/treatments/dental-trauma"],
  ["treatment-general-anaesthesia", "/treatments/general-anaesthesia"],
  ["special-needs", "/special-needs"],
  ["comfort-and-sedation", "/comfort-and-sedation"],
  ["no-cavity-club", "/no-cavity-club"],
  ["growing-up-smiling", "/growing-up-smiling"],
  ["meet-the-doctor", "/meet-the-doctor"],
  ["emergency", "/emergency"],
  ["for-parents", "/for-parents"],
  ["book", "/book"],
  ["contact", "/contact"],
  ["reviews", "/reviews"],
  ["privacy", "/privacy"],
  ["mockups", "/mockups"],
  ["404", "/this-page-does-not-exist"],
];

const viewports = [
  { label: "390w", width: 390, height: 844 },
  { label: "1440w", width: 1440, height: 900 },
];

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let devServer;
  const alreadyUp = await waitForServer(BASE_URL, 1);
  if (!alreadyUp) {
    console.log("Starting dev server...");
    devServer = spawn("npm", ["run", "dev"], {
      shell: true,
      stdio: "ignore",
    });
    const up = await waitForServer(BASE_URL, 90);
    if (!up) {
      console.error("Dev server did not become ready in time.");
      process.exit(1);
    }
  }

  const browser = await chromium.launch();

  /*
    Chromium refuses to composite a screenshot surface larger than 16384px in
    either dimension, and it fails *silently* — the tail of the image just
    comes back blank white. Home is ~9700 CSS px tall, which at DPR 2 is
    19392px, so the closing CTA and footer were quietly missing from the deck.

    So the scale factor is chosen per page: 2 where it fits, 1 where it
    doesn't. A slightly softer image beats a truncated one.
  */
  const MAX_SURFACE = 16384;

  for (const viewport of viewports) {
    const makeCtx = (dpr) =>
      browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: dpr,
      });

    const context = await makeCtx(2);
    const page = await context.newPage();
    let loRes = null;

    for (const [name, route] of routes) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      // Force every lazy-loaded image to fetch before capture, then wait for
      // the network to go quiet again so on-demand image resizing finishes.
      await page.evaluate(async () => {
        // `behavior: "instant"` matters: the site sets scroll-behavior:smooth,
        // so a plain scrollTo animates and the loop finishes long before the
        // page has actually moved — leaving lazy images unfetched and
        // scroll-revealed sections still hidden in the capture.
        const step = Math.round(window.innerHeight * 0.8);
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 110));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 120));
      });
      await page.waitForLoadState("networkidle");
      // A position:sticky header composites over page content in a fullPage
      // capture, so it overlaps whatever sits mid-page. Pin it for the shot.
      await page.addStyleTag({
        content: "header{position:static !important}",
      });
      await page.waitForTimeout(300);

      const file = path.join(OUT_DIR, `${name}_${viewport.label}.png`);
      const pageHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );

      if (pageHeight * 2 <= MAX_SURFACE) {
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${file}`);
      } else {
        // Too tall for DPR 2 — recapture this one at DPR 1.
        loRes ??= await (await makeCtx(1)).newPage();
        await loRes.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
        await loRes.evaluate(async () => {
          const step = Math.round(window.innerHeight * 0.8);
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo({ top: y, behavior: "instant" });
            await new Promise((r) => setTimeout(r, 110));
          }
          window.scrollTo({ top: 0, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 120));
        });
        await loRes.waitForLoadState("networkidle");
        await loRes.addStyleTag({ content: "header{position:static !important}" });
        await loRes.waitForTimeout(300);
        await loRes.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${file}  (DPR 1 — ${pageHeight}px tall)`);
      }
    }

    await context.close();
  }

  await browser.close();
  if (devServer) devServer.kill();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
