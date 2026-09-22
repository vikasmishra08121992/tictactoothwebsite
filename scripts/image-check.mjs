/**
 * Checks that every photograph is served at the resolution its box needs.
 *
 * `next/image` cannot know how wide an image will actually render — it trusts
 * the `sizes` attribute we write. When `sizes` understates the box, the
 * browser picks a smaller candidate from the srcset and the photograph is
 * upscaled by the browser: the file is fine, the markup asked for the wrong
 * one. That is invisible in code review and is exactly how a photo-led site
 * ends up looking soft.
 *
 * This measures the real rendered box at each breakpoint, works out what a
 * 2x display needs, and compares it to the candidate the browser actually
 * chose. Run against a production build — `next dev` does not always emit the
 * same srcset.
 *
 * Usage: npm run images
 */

import { chromium } from "playwright";
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const BASE_URL = process.env.SHOTS_BASE_URL ?? "http://localhost:3000";

const routes = [
  "/",
  "/our-space",
  "/treatments",
  "/special-needs",
  "/comfort-and-sedation",
  "/no-cavity-club",
  "/growing-up-smiling",
  "/meet-the-doctor",
  "/for-parents",
  "/contact",
];

const viewports = [
  { label: "390", width: 390, height: 844 },
  { label: "768", width: 768, height: 1024 },
  { label: "1024", width: 1024, height: 768 },
  { label: "1440", width: 1440, height: 900 },
];

/** Shortfall we are willing to ignore: a candidate within this of the target. */
const TOLERANCE = 0.88;

/**
 * Intrinsic width of every master on disk, keyed by its public path.
 *
 * This has to come from the file, not from `img.naturalWidth`: naturalWidth
 * reports the candidate the browser actually decoded, so using it as the
 * ceiling makes the comparison compare a number to itself and pass always.
 */
async function masterWidths() {
  const out = new Map();
  const walk = (d, acc = []) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p, acc);
      else acc.push(p);
    }
    return acc;
  };
  for (const f of walk("public/images")) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    const m = await sharp(f).metadata();
    out.set("/" + f.split(sep).join("/").replace(/^public\//, ""), m.width);
  }
  return out;
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  if (!(await waitForServer(BASE_URL, 3))) {
    console.error(`No server at ${BASE_URL}. Start one first (npm run build && npm start).`);
    process.exit(1);
  }

  const masters = await masterWidths();
  const browser = await chromium.launch();
  const findings = [];
  const tooSmall = new Map();

  for (const vp of viewports) {
    // deviceScaleFactor 2 is the case that matters: almost every phone and
    // every recent laptop is 2x or better, so this is the common path, not an
    // edge case.
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      // Scroll the page so lazy images below the fold actually load, then
      // return to the top so positions are reported consistently.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(500);

      const rows = await page.evaluate(() => {
        const parseW = (url) => {
          const m = /[?&]w=(\d+)/.exec(url || "");
          return m ? Number(m[1]) : null;
        };
        return [...document.querySelectorAll("img")]
          .map((img) => {
            const r = img.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) return null; // hidden or spacer
            return {
              src: (img.getAttribute("src") || "").replace(/^.*?url=/, "").split("&")[0],
              sizes: img.getAttribute("sizes") || "(none)",
              boxW: Math.round(r.width),
              chosen: parseW(img.currentSrc),
              natural: img.naturalWidth,
            };
          })
          .filter(Boolean);
      });

      for (const row of rows) {
        if (!row.chosen) continue; // unoptimized or data URI
        const needed = row.boxW * 2;
        const file = decodeURIComponent(row.src);
        const master = masters.get(file);

        // A master narrower than the box needs is a photography problem, not
        // a markup one — no `sizes` can conjure pixels that are not in the
        // file. Reported separately so the two never get confused.
        if (master && master < needed * TOLERANCE) {
          const prev = tooSmall.get(file);
          if (!prev || needed > prev.needed) {
            tooSmall.set(file, { master, needed, boxW: row.boxW, route, vp: vp.label });
          }
        }

        // The candidate can never beat the master, so cap the target there.
        const ceiling = Math.min(needed, master ?? needed);
        if (row.chosen < ceiling * TOLERANCE) {
          findings.push({
            route,
            vp: vp.label,
            src: decodeURIComponent(row.src).replace("/images/", ""),
            sizes: row.sizes,
            boxW: row.boxW,
            needed,
            chosen: row.chosen,
            ratio: (row.chosen / needed).toFixed(2),
          });
        }
      }
    }

    await context.close();
  }

  await browser.close();

  const report = () => {
    if (!tooSmall.size) return;
    console.log("");
    console.log(`! ${tooSmall.size} file(s) smaller than the box they fill — need a better original:`);
    console.log("");
    for (const [file, d] of tooSmall) {
      console.log(`   ${file.replace("/images/", "")}`);
      console.log(`      master ${d.master}px, but ${d.route} @${d.vp} renders it ${d.boxW}px (needs ${d.needed} at 2x)`);
    }
    console.log("");
  };

  if (!findings.length) {
    console.log("\n✓ images: every sizes attribute matches its rendered box.\n");
    report();
    return;
  }

  console.log(`\n✗ images: ${findings.length} under-served\n`);
  console.log("route            vp    box   need  got   ratio  sizes / file");
  for (const f of findings) {
    console.log(
      `${f.route.padEnd(16)} ${f.vp.padEnd(5)} ${String(f.boxW).padStart(4)} ${String(f.needed).padStart(5)} ${String(f.chosen).padStart(5)}  ${f.ratio}   ${f.sizes}`
    );
    console.log(`${" ".repeat(40)}${f.src}`);
  }
  report();
  process.exitCode = 1;
}

main();
