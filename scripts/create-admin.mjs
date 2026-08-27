/**
 * Creates the first administrator.
 *
 * There is no public sign-up — a system holding children's records must not
 * have one — so the first account has to be made out of band. Every account
 * after this one is created from /admin/people.
 *
 * Two things have to happen together: an auth user, and a `profiles` row
 * giving them a role. Only the second is what `auth_role()` reads, so an auth
 * user without a profile can sign in and then see nothing, which looks like a
 * bug rather than a missing step. This does both, and deletes the auth user
 * again if the profile insert fails rather than leaving that half-state behind.
 *
 *   node scripts/create-admin.mjs <email> <password> "<full name>"
 */

import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./load-env.mjs";

const [email, password, ...nameParts] = process.argv.slice(2);
const fullName = nameParts.join(" ");

if (!email || !password || !fullName) {
  console.error(
    'Usage: node scripts/create-admin.mjs <email> <password> "<full name>"'
  );
  process.exit(1);
}

requireEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Loud, because pointing this at production and creating an account whose
// password is sitting in a shell history is exactly the mistake to prevent.
if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
  console.warn(`\n  ⚠  This is a REMOTE project: ${url}`);
  console.warn("     Creating a real administrator account with a password");
  console.warn("     typed on the command line. Ctrl-C now if unintended.\n");
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error(`Could not create the auth user: ${error.message}`);
  process.exit(1);
}

const { error: profileError } = await admin.from("profiles").insert({
  id: data.user.id,
  full_name: fullName,
  role: "admin",
  is_active: true,
});

if (profileError) {
  // Roll back rather than leave an account that can sign in and see nothing.
  await admin.auth.admin.deleteUser(data.user.id);
  console.error(`Could not create the profile: ${profileError.message}`);
  console.error("The auth user has been removed. Nothing was left behind.");
  process.exit(1);
}

console.log(`\n  Administrator created: ${fullName} <${email}>`);
console.log("  Sign in at /auth/sign-in\n");
