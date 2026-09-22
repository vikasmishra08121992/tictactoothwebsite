# Deployment

Two Supabase projects, one Vercel project. Preview deploys point at the dev
database; production points at its own.

**Never point a preview deploy at the production database.** Preview branches
run unreviewed code against whatever is in that database, and here that is
children's names, dates of birth and parents' mobile numbers.

---

## 1. Supabase

Create two projects — `tictactooth-dev` and `tictactooth-prod`. Pick the
region closest to Ahmedabad so that a booking made on a phone in Maninagar
does not round-trip across the world.

**Production should be on the Pro plan.** Free projects pause after a period of
inactivity and carry limited backup retention. Load is not the reason — this
application is small. A paused project means the booking form stops working
and reception finds out when the phone starts ringing, and thin backups on
children's records are a risk the clinic should accept knowingly rather than
discover. This is a real monthly cost and the client's decision to make.

Apply migrations in order, to each project:

```bash
npx supabase link --project-ref <ref>
```

```bash
npx supabase db push
```

`db push` applies migrations but does **not** run the seed. `supabase/seed.sql`
holds opening hours, treatment types and the consent wording — configuration
only, no patient data, and it must never be given any. On a brand-new project,
seed it by pasting `supabase/seed.sql` into the dashboard's SQL Editor, or by
resetting the linked database, which re-applies every migration and then seeds:

```bash
npx supabase db reset --linked
```

**`db reset --linked` drops everything in that database.** It is the right
command on a project that has never held real data and the wrong one on any
project that has. There is no `supabase db execute`.

### The first admin account

There is no public sign-up, so the first administrator has to be created by
hand — every account after that is created from `/admin/people`. In the
Supabase dashboard, add a user under Authentication, then insert their profile:

```sql
insert into profiles (id, full_name, role, is_active)
values ('<the-new-user-uuid>', '<their name>', 'admin', true);
```

Hand the password over in person. Not by email, not on WhatsApp — it opens a
system holding patient records.

---

## 2. Vercel

Import the repository. Framework detection handles the build.

Environment variables — set these per environment, not once for all three:

| Variable | Preview | Production | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | dev project | prod project | reaches the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dev project | prod project | reaches the browser; safe only because RLS denies `anon` every table |
| `SUPABASE_SERVICE_ROLE_KEY` | dev project | prod project | **bypasses RLS** — server-only, never `NEXT_PUBLIC_` |
| `CRON_SECRET` | any value | strong random | the maintenance endpoint refuses to run without it |
| `IP_HASH_SALT` | any value | strong random | salts the rate-limit IP hashes |
| `RESEND_API_KEY` | test key | live key | |
| `NOTIFICATIONS_FROM_EMAIL` | verified sender | verified sender | |
| `WHATSAPP_ENABLED` | `false` | `false` until approved | see DECISIONS.md |

`vercel.json` registers the hourly cron against `/api/cron/maintenance`, which
expires abandoned pending requests and purges records past the retention
period. Confirm it appears under the project's Cron Jobs after the first
production deploy — if that job is not running, slots leak and retention is not
being enforced.

---

## 3. Before every production deploy

```bash
npm run rls
```

This is the check that matters. The anon key ships inside the client bundle and
can be read straight out of the JavaScript, so everything enforced in React or
in a server action is bypassable. RLS is not. The probe talks to the database
with the key an attacker would use and asserts that every table returns nothing
and that only the three intended public functions are callable.

Run it against the production URL and anon key before going live, and on every
deploy after that. RLS regressions are silent — nothing errors and nothing
looks broken; the data is simply readable.

```bash
npm run build       # zero TypeScript errors
npm run a11y        # WCAG 2.2 AA, all routes
npm run responsive  # overflow and touch targets at 390 / 768 / 1024 / 1440
```

To include the calendar and admin forms in the last two, set
`A11Y_STAFF_EMAIL` and `A11Y_STAFF_PASSWORD` for an account on the **dev**
project. Without them those scripts audit public routes only and say so.

---

## 4. Not yet done, and blocking go-live

These are not engineering tasks and cannot be closed from this repository.
`DECISIONS.md` holds the reasoning for each.

- **Legal sign-off on `/privacy`**, and the retention period it references.
  The page is a structural draft with bracketed placeholders for decisions the
  clinic and its lawyer must make.
- **Data processing agreements** with the hosting, email and messaging
  providers named in that notice.
- **Consent wording** — `consent_texts` version 1 is placeholder text marked
  `[LEGAL REVIEW REQUIRED]`. It is stored verbatim against every consent
  record, so shipping placeholder wording means recording consent to nothing.
- **Real clinic details** — phone, WhatsApp number and opening hours, set from
  `/admin/configuration` rather than in code.
- **WhatsApp**: Meta Business verification, a BSP, and template approval.
- **The 18-year-old self-booking branch**, deferred as a legal question and now
  live, because real consent is being recorded.
