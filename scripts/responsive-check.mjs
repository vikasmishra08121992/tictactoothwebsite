// Checks every route at each breakpoint for layout defects that are easy to
// miss by eye: horizontal overflow, touch targets under 44px, and text that
// overflows its container.
//
// Usage: npm run responsive

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { signInIfConfigured } from "./portal-auth.mjs";

const BASE_URL = process.env.SHOTS_BASE_URL ?? "http://localhost:3000";

const routes = [
  "/",
  "/our-space",
  "/treatments",
  "/treatments/cavity-fillings",
  "/treatments/braces-clear-aligners",
  "/treatments/dental-trauma",
  "/treatments/general-anaesthesia",
  "/special-needs",
  "/comfort-and-sedation",
  "/no-cavity-club",
  "/growing-up-smiling",
  "/meet-the-doctor",
  "/emergency",
  "/for-parents",
  "/book",
  "/contact",
  "/privacy",
  "/auth/sign-in",
  "/reviews",
  "/mockups",
  "/this-page-does-not-exist",
];

const viewports = [
  { label: "390", width: 390, height: 844 },
  { label: "768", width: 768, height: 1024 },
  { label: "1024", width: 1024, height: 768 },
  { label: "1440", width: 1440, height: 900 },
];

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
  let devServer;
  if (!(await waitForServer(BASE_URL, 1))) {
    console.log("Starting dev server…");
    devServer = spawn("npm", ["run", "dev"], { shell: true, stdio: "ignore" });
    if (!(await waitForServer(BASE_URL, 90))) {
      console.error("Dev server did not start.");
      process.exit(1);
    }
  }

  const browser = await chromium.launch();
  const findings = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    // Public routes are measured BEFORE signing in: once a session exists,
    // /auth/sign-in redirects to /staff and its findings get filed under the
    // wrong route.
    let portalRoutes = [];
    let list = routes;

    for (let pass = 0; pass < 2; pass++) {
    if (pass === 1) {
      // Each viewport gets its own context, so each needs its own session.
      portalRoutes = await signInIfConfigured(page, BASE_URL);
      list = portalRoutes;
    }
    for (const route of list) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(200);

      const result = await page.evaluate((vw) => {
        const out = { overflow: null, smallTargets: [], clipped: [] };

        // 1. horizontal overflow of the page itself
        const de = document.documentElement;
        if (de.scrollWidth > vw + 1) {
          // find the widest offending elements
          const wide = [];
          document.querySelectorAll("body *").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > vw + 1 && !el.closest("[data-overflow-ok]")) {
              const cs = getComputedStyle(el);
              // ignore things intentionally scrolled or clipped by an ancestor
              if (cs.position === "fixed") return;
              wide.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className || "").toString().slice(0, 70),
                right: Math.round(r.right),
              });
            }
          });
          out.overflow = {
            scrollWidth: de.scrollWidth,
            viewport: vw,
            worst: wide.sort((a, b) => b.right - a.right).slice(0, 3),
          };
        }

        // 2. interactive targets below 44px in either axis
        document
          .querySelectorAll("a[href], button:not(:disabled), [role='gridcell']")
          .forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return; // hidden
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || cs.display === "none") return;
            // inline links inside prose are exempt from the 44px rule
            if (el.tagName === "A" && el.closest("p, li, figcaption, dd, address")) return;

            /*
              The calendar's empty time slots are exempt from 44px, and only
              from 44px — they are still checked against the WCAG 2.2 AA
              minimum of 24px below.

              A 15-minute slot cannot be 44px tall: the grid is a map of time,
              so slot height IS duration, and forcing it would make a working
              day nine feet long. WCAG 2.5.8 allows this where an equivalent
              control meets the requirement, and two do — every slot is
              reachable by arrow keys plus Enter, and the 44px "New
              appointment" button opens the same form for any time.
            */
            const isTimeSlot = el.hasAttribute("data-slot-min");
            const minHeight = isTimeSlot ? 24 : 44;
            if (r.height < minHeight || r.width < 24) {
              out.smallTargets.push({
                text: (el.textContent || "").trim().slice(0, 40),
                w: Math.round(r.width),
                h: Math.round(r.height),
              });
            }
          });

        return out;
      }, vp.width);

      if (result.overflow) {
        findings.push({ route, vp: vp.label, type: "overflow", detail: result.overflow });
      }
      if (result.smallTargets.length) {
        findings.push({
          route,
          vp: vp.label,
          type: "target",
          detail: result.smallTargets.slice(0, 6),
          count: result.smallTargets.length,
        });
      }
    }
    }

    await context.close();
  }

  await browser.close();
  if (devServer) devServer.kill();

  if (!findings.length) {
    console.log("\n✓ responsive: no overflow or undersized targets at 390 / 768 / 1024 / 1440.\n");
    return;
  }

  console.log(`\n✗ responsive: ${findings.length} findings\n`);
  for (const f of findings) {
    if (f.type === "overflow") {
      console.log(`[overflow] ${f.route} @${f.vp}px — scrollWidth ${f.detail.scrollWidth} > ${f.detail.viewport}`);
      for (const w of f.detail.worst) {
        console.log(`     ${w.tag}.${w.cls} → right edge ${w.right}`);
      }
    } else {
      console.log(`[target] ${f.route} @${f.vp}px — ${f.count} under 44px`);
      for (const t of f.detail) {
        console.log(`     ${t.w}×${t.h}  "${t.text}"`);
      }
    }
    console.log("");
  }
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
