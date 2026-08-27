// WCAG 2.2 AA audit across every route.
// Usage: npm run a11y   (dev server started automatically if not running)

import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
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

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

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
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  let total = 0;
  const seen = new Map();
  const detail = [];

  /*
    Public routes are audited BEFORE signing in, deliberately.

    Signing in first meant /auth/sign-in redirected to /staff, so the calendar
    was audited twice and its violations were reported against the sign-in
    page — sending anyone reading the report to look at the wrong file.
  */
  /*
    Public routes are audited BEFORE signing in, deliberately.

    Signing in first meant /auth/sign-in redirected to /staff, so the calendar
    was audited twice and its violations were reported against the sign-in
    page — sending anyone reading the report to look at the wrong file.
  */
  async function audit(list) {
    for (const route of list) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(250);

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

      for (const v of results.violations) {
        total += v.nodes.length;
        const key = `${v.id}`;
        if (!seen.has(key)) {
          seen.set(key, {
            id: v.id,
            impact: v.impact,
            help: v.help,
            count: 0,
            where: new Set(),
            sample: v.nodes[0]?.html?.slice(0, 160),
          });
        }
        const rec = seen.get(key);
        rec.count += v.nodes.length;
        rec.where.add(route);

        for (const n of v.nodes) {
          detail.push({
            rule: v.id,
            route,
            target: n.target?.join(" "),
            html: n.html?.slice(0, 200),
            summary: n.failureSummary?.replace(/\s+/g, " ").slice(0, 300),
          });
        }
      }
    }
  }

  await audit(routes);

  const portalRoutes = await signInIfConfigured(page, BASE_URL);
  await audit(portalRoutes);

  await browser.close();
  if (devServer) devServer.kill();

  await mkdir("exports", { recursive: true });
  await writeFile("exports/a11y-report.json", JSON.stringify(detail, null, 2));

  if (total === 0) {
    console.log("\n✓ axe: no violations across all routes.\n");
    return;
  }

  console.log(`\n✗ axe: ${total} violation instances\n`);
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const rows = [...seen.values()].sort(
    (a, b) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9)
  );
  for (const r of rows) {
    console.log(`[${r.impact}] ${r.id} — ${r.help}`);
    console.log(`   instances: ${r.count}`);
    console.log(`   routes: ${[...r.where].slice(0, 6).join(", ")}${r.where.size > 6 ? ` +${r.where.size - 6} more` : ""}`);
    if (r.sample) console.log(`   sample: ${r.sample}`);
    console.log("");
  }
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
