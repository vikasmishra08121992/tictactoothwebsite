/**
 * Optional sign-in for the audit scripts.
 *
 * The public site is auditable by anyone; the calendar and admin forms are
 * behind a login, and a dense grid of slots is the single most likely place to
 * lose the AA standard the rest of the site holds. Leaving those routes out of
 * `npm run a11y` and `npm run responsive` would mean the hardest surfaces are
 * the only unchecked ones.
 *
 * So: set A11Y_STAFF_EMAIL and A11Y_STAFF_PASSWORD (an account on a dev or
 * preview project, never production) and the portal routes are included. With
 * no credentials the scripts run exactly as before and say what they skipped —
 * silently covering fewer routes than the operator believes is worse than
 * covering none.
 */

export const PORTAL_ROUTES = [
  "/staff",
  "/staff/records",
  "/admin/configuration",
  "/admin/people",
  "/admin/records",
];

export async function signInIfConfigured(page, baseUrl) {
  const email = process.env.A11Y_STAFF_EMAIL;
  const password = process.env.A11Y_STAFF_PASSWORD;

  if (!email || !password) {
    console.log(
      "\n  Skipping portal routes: A11Y_STAFF_EMAIL / A11Y_STAFF_PASSWORD are not set."
    );
    return [];
  }

  await page.goto(`${baseUrl}/auth/sign-in`, { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');

  try {
    await page.waitForURL(/\/(staff|admin)/, { timeout: 15000 });
  } catch {
    console.error("  Sign-in failed — portal routes will not be audited.");
    return [];
  }

  // An account without the admin role is redirected away from /admin/*, which
  // would quietly audit /staff five times and report a clean sweep.
  const isAdmin = await page.evaluate(async () => {
    const res = await fetch("/admin/configuration", { redirect: "manual" });
    return res.type !== "opaqueredirect" && res.status < 400;
  });

  if (!isAdmin) {
    console.log("  Signed in as a receptionist — auditing staff routes only.");
    return PORTAL_ROUTES.filter((r) => r.startsWith("/staff"));
  }

  console.log("  Signed in as an administrator — auditing all portal routes.");
  return PORTAL_ROUTES;
}
