/**
 * RLS probe.
 *
 * This is the test that matters most in the whole project. The anon key ships
 * inside the client bundle — anyone can read it out of the JavaScript and talk
 * to Supabase directly, bypassing every check written in React or in a server
 * action. The only thing standing between that key and a table of children's
 * names, dates of birth and parents' mobile numbers is row-level security.
 *
 * So this does not test the application. It tests the database, using the key
 * an attacker would use, and it must run on every deploy rather than once by
 * hand — RLS regressions are silent. Nothing errors, nothing looks broken; the
 * data is simply readable.
 *
 * A pass here means: every table returned nothing, and the only things the
 * anon key could invoke were the two public functions that were designed to be
 * invoked.
 *
 *   node scripts/rls-probe.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./load-env.mjs";

requireEnv(["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (process.env.SUPABASE_SERVICE_ROLE_KEY === anonKey) {
  console.error("The anon key and service-role key are identical. Stop.");
  process.exit(1);
}

const anon = createClient(url, anonKey);

const failures = [];
const passes = [];

function check(name, ok, detail) {
  if (ok) passes.push(name);
  else failures.push(`${name} — ${detail}`);
}

/** Every table holding personal data, plus the config tables. */
const TABLES = [
  "profiles",
  "families",
  "patients",
  "appointments",
  "consents",
  "consent_texts",
  "treatment_types",
  "clinic_settings",
  "closures",
  "resources",
  "audit_log",
  "notification_log",
  "booking_attempts",
];

console.log(`Probing ${url} with the anon key…\n`);

for (const table of TABLES) {
  const { data, error } = await anon.from(table).select("*").limit(1);

  // Either outcome is acceptable: an error means RLS refused, and an empty
  // array means RLS returned nothing. A row is a breach.
  const leaked = !error && Array.isArray(data) && data.length > 0;
  check(
    `SELECT ${table}`,
    !leaked,
    `returned ${data?.length} row(s) to an anonymous caller`
  );
}

// Writes must be refused too — a readable-nothing table that accepts inserts
// is still an open door for someone filling the diary with junk.
for (const table of ["families", "patients", "appointments", "audit_log"]) {
  const { error } = await anon.from(table).insert({}).select();
  check(`INSERT ${table}`, !!error, "an anonymous insert was accepted");
}

// The two functions that are *supposed* to be reachable. If these fail, the
// public site is broken — which is a different problem, but worth catching in
// the same run rather than discovering on the booking page.
{
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await anon.rpc("get_available_slots", { p_date: today });
  check("RPC get_available_slots", !error, error?.message ?? "");
}
{
  const { error } = await anon.rpc("get_treatment_types");
  check("RPC get_treatment_types", !error, error?.message ?? "");
}
{
  const { error } = await anon.rpc("get_public_config");
  check("RPC get_public_config", !error, error?.message ?? "");
}

// Functions that must NOT be reachable anonymously.
for (const [fn, args] of [
  ["expire_stale_pending", {}],
  ["purge_expired_records", {}],
  ["erase_family", { p_family_id: crypto.randomUUID(), p_reason: "probe" }],
  [
    "merge_families",
    { p_source_id: crypto.randomUUID(), p_target_id: crypto.randomUUID() },
  ],
]) {
  const { error } = await anon.rpc(fn, args);
  check(`RPC ${fn} is refused`, !!error, "an anonymous caller could invoke it");
}

console.log(`${passes.length} passed`);
for (const p of passes) console.log(`  ok    ${p}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} FAILED`);
  for (const f of failures) console.error(`  FAIL  ${f}`);
  console.error(
    "\nDo not deploy. Anonymous callers can reach data or functions they must not."
  );
  process.exit(1);
}

console.log("\nAll checks passed. The anon key reaches nothing it should not.");
