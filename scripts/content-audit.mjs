/**
 * Content audit.
 *
 * Every unverified fact on this site is marked in the source with a bracketed
 * token — [PLACEHOLDER: …], [CONFIRM: …], [CLINICAL REVIEW REQUIRED],
 * [LEGAL REVIEW REQUIRED]. That convention exists because the brief forbids
 * inventing facts, and a marker is the honest alternative to plausible copy.
 *
 * This walks the source and prints what is still outstanding, grouped by who
 * has to resolve it. It is generated rather than hand-maintained: a checklist
 * that has to be updated by hand goes stale the first time someone forgets,
 * and then quietly under-reports what is still missing before launch.
 *
 *   npm run content
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib/content", "supabase"];
const EXT = [".ts", ".tsx", ".sql"];

const TOKEN =
  /\[(PLACEHOLDER[^\]]*|CONFIRM[^\]]*|CLINICAL REVIEW REQUIRED|LEGAL REVIEW REQUIRED|REAL GOOGLE REVIEWS TO BE SUPPLIED)\]/g;

/** Who has to resolve each kind of marker. */
function owner(text) {
  if (/^CLINICAL REVIEW/.test(text)) return "Dentist — clinical sign-off";
  if (/^LEGAL REVIEW/.test(text)) return "Lawyer — legal sign-off";
  if (/GOOGLE REVIEWS/.test(text)) return "Client — real reviews";
  if (/PHOTO/.test(text)) return "Client — photography";
  return "Client — facts to supply";
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (EXT.some((e) => name.endsWith(e))) out.push(path);
  }
  return out;
}

const byOwner = new Map();
let total = 0;

for (const root of ROOTS) {
  for (const path of walk(root)) {
    const lines = readFileSync(path, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const m of line.matchAll(TOKEN)) {
        total++;
        const who = owner(m[1]);
        if (!byOwner.has(who)) byOwner.set(who, []);
        byOwner.get(who).push({
          file: path.split("\\").join("/"),
          line: i + 1,
          text: m[1].replace(/\s+/g, " ").slice(0, 130),
        });
      }
    });
  }
}

console.log(`\n  ${total} items still outstanding before this site can go live.\n`);

for (const [who, items] of [...byOwner].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n  ${who} — ${items.length}`);
  console.log(`  ${"─".repeat(60)}`);
  let lastFile = "";
  for (const it of items) {
    if (it.file !== lastFile) {
      console.log(`\n    ${it.file}`);
      lastFile = it.file;
    }
    console.log(`      ${String(it.line).padStart(4)}  ${it.text}`);
  }
}

console.log(
  "\n  Nothing above is a bug. Each one is a fact this project refuses to\n" +
    "  invent, and every one must be replaced with a real answer — or the\n" +
    "  claim removed — before launch.\n"
);
