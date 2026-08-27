/**
 * Reads .env.local for the standalone scripts, and fails with instructions
 * rather than a bare "not set".
 *
 * The scripts here run outside Next.js, which does its own env loading, so
 * they need this. It is a few lines rather than a dependency because the file
 * format we actually use is `KEY=value` and nothing more.
 *
 * The diagnostics matter more than the parsing. "NEXT_PUBLIC_SUPABASE_URL is
 * not set" is true but useless — the person reading it has usually copied
 * .env.example and not yet pasted anything in, and what they need is the name
 * of the file and where the value comes from.
 */

import { readFileSync, existsSync } from "node:fs";

export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

const WHERE = {
  NEXT_PUBLIC_SUPABASE_URL:
    "Supabase dashboard → Project Settings → API → Project URL\n" +
    "      (looks like https://abcdefgh.supabase.co)",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    "Supabase dashboard → Project Settings → API keys → the PUBLIC key\n" +
    '      (labelled "anon public", or "publishable" on newer projects)',
  SUPABASE_SERVICE_ROLE_KEY:
    "Supabase dashboard → Project Settings → API keys → the SECRET key\n" +
    '      (labelled "service_role", or "secret" on newer projects — click Reveal)',
  CRON_SECRET: "any random text you like — it is a shared secret, not a lookup",
  IP_HASH_SALT: "any random text you like, different from CRON_SECRET",
};

/**
 * Exits with a readable explanation if any required variable is missing or
 * still blank. Blank is treated as missing: copying .env.example leaves every
 * key present with an empty value, which is the most common state to be in.
 */
export function requireEnv(names) {
  loadEnv();

  const missing = names.filter((n) => !process.env[n]?.trim());
  if (missing.length === 0) return;

  const hasFile = existsSync(".env.local");

  console.error("\n  Cannot run — the Supabase connection is not configured.\n");

  if (!hasFile) {
    console.error("  There is no .env.local file. Create one:\n");
    console.error("      cp .env.example .env.local\n");
  } else {
    console.error(
      `  .env.local exists, but ${
        missing.length === 1 ? "this value is" : "these values are"
      } still blank.`
    );
    console.error("  Copying .env.example gives you the keys without the values —");
    console.error("  they have to be pasted in.\n");
  }

  for (const name of missing) {
    console.error(`    ${name}`);
    console.error(`      ${WHERE[name] ?? "see .env.example"}\n`);
  }

  console.error("  Full walkthrough: TESTING.md, step 3.\n");
  process.exit(1);
}
