# Testing it locally

The app runs on your machine. The database lives in a free Supabase project in
the cloud, so there is nothing to install beyond what you already have.

You need Node and npm. You have them — `node -v` should print v22 or later.

> **Why not a local database?** You can run one, but on Windows it means
> installing Docker Desktop: a large download, WSL2, and a reboot. A free
> Supabase project takes about three minutes and behaves identically. If you
> would rather go fully offline later, see the last section.

Roughly 15 minutes, mostly waiting for the project to provision.

> **Already set up on this machine.** Steps 1–4 have been done for the project
> at `yrlkonmcjiycrghmphne` — `.env.local` is filled in, all ten migrations and
> the seed are applied, and an admin account exists. Skip to **step 5**. The
> steps below are the record of how, and what to do for a second project.

---

## 1. Create the database (~5 min)

1. Go to **supabase.com** and sign up — GitHub sign-in is quickest, and the
   free tier needs no card.
2. **New project**. Name it `tictactooth-dev`.
3. Set a database password. **Save it somewhere** — you cannot see it again,
   though you will not need it for this walkthrough.
4. Region: **South Asia (Mumbai)** — closest to Ahmedabad.
5. Click **Create new project** and wait a minute or two while it provisions.

This is a test database. Do not put anyone's real details into it.

---

## 2. Create the tables (~2 min)

Generate one file containing all eight migrations plus the seed:

```bash
npm run db:bundle
```

That writes `exports/bootstrap.sql`.

1. In the Supabase dashboard, open **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `exports/bootstrap.sql`, select all of it, and paste it in.
4. Click **Run** (or Ctrl-Enter).

It should finish in a few seconds with *Success. No rows returned*. If it
reports an error, stop and send me the message — the SQL has never been
executed against a real Postgres, so an error here is a genuine bug in it and
not something you did wrong.

Check it worked: open **Table Editor** and you should see `appointments`,
`patients`, `families`, `treatment_types` and about nine others.

---

## 3. Connect the app to it (~3 min)

In the dashboard, go to **Project Settings** (the gear, bottom of the sidebar)
→ **API keys**. You need three values from that page:

- **Project URL** — looks like `https://abcdefgh.supabase.co`
- **anon / public** key — a long string
- **service_role** key — another long string, behind a *Reveal* button

Now create your environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and fill in five lines. Leave everything else
blank:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-the-anon-key
SUPABASE_SERVICE_ROLE_KEY=paste-the-service-role-key
CRON_SECRET=any-random-text-will-do
IP_HASH_SALT=any-other-random-text
```

`.env.local` is gitignored and will not be committed.

The **service_role key bypasses every security rule in the database.** It is
fine in a local file for a test project. Never paste it into a chat, a ticket,
a screenshot, or anything with a `NEXT_PUBLIC_` prefix.

Leave `RESEND_API_KEY` and the WhatsApp variables empty. Emails will be
recorded as failed attempts, which is the correct behaviour and will not block
any bookings.

---

## 4. Create your admin login (~1 min)

There is no sign-up page — a system holding children's records must not have
one — so the first account is created from the command line:

```bash
npm run create-admin -- admin@test.local Test1234! "Test Admin"
```

You should see `Administrator created`. Every account after this one gets
created from inside the app, at `/admin/people`.

---

## 5. Run it

```bash
npm run dev
```

Open **http://localhost:3000**. Sign in at `/auth/sign-in` with
**admin@test.local** / **Test1234!**

There is already one test booking in the calendar — "TestChild" on
28/08/2026 — created while verifying the database. Delete it from
`/admin/records` whenever you like.

---

## What to try, in order

**Book an appointment as a parent** — go to `/book`.

- Pick a reason. These come from the database now, so the durations shown are
  real.
- Pick a room.
- Pick a date **3 or 4 days from today**, and not a Sunday. Today and tomorrow
  will often show nothing, which is correct: the seed sets a 12-hour minimum
  notice, opens Mon–Sat 10:00–13:00 and 14:00–19:00, and closes on Sundays.
- The times that appear are genuinely free slots — the clinic's opening hours,
  minus the lunch break, minus anything already booked.
- Fill in the rest and confirm. You will get a booking reference.

**See it arrive as reception** — go to `/staff` and sign in with
`admin@test.local` / `Test1234!`.

The booking should be on the calendar with a **dashed gold border** — that is
"pending", meaning it is holding the slot but has not been confirmed. Click it
and confirm it. The border becomes solid.

**Watch it appear live** — open `/staff` in one tab and `/book` in another.
Make a booking. It should appear on the calendar without you refreshing.

**Try to double-book** — note a time you have already booked, then go back to
`/book` and choose the same date. That time should no longer be offered.

**See the duplicate-records behaviour** — book twice using the same mobile
number, then go to `/staff/records`. You will see **two separate families**,
both marked *Unverified — booked online*.

This is deliberate, and it is the single most important design decision in the
system. A mobile number typed into a public form is a claim, not proof. If the
app matched on it, anyone who guessed your number would inherit your children
and their entire visit history. So reception merges duplicates by hand, looking
at both records. Try it: click **Merge duplicates into this** on one, then
**Merge this into…** on the other.

> A third booking on the same mobile will be refused with *"You already have a
> pending request"*. That is the rate limit working: the seed allows two
> outstanding **pending** requests per number, because a pending request holds
> a slot and an unthrottled form could fill the whole diary. Confirm one of
> them on `/staff` and the count drops, letting you book again.

**Change the clinic's configuration** — go to `/admin/configuration`, change
the opening hours, save, then reload `/book` and pick a date. The available
times will have changed to match.

**Add a receptionist** — `/admin/people` → add a staff account with the
Receptionist role. Sign out, sign in as them. They can see the calendar and
records, but `/admin/*` bounces them back to `/staff`, and they have no
**Erase** button.

**Erase a family** — back as the admin, `/admin/records` → **Erase on
request**. It deletes the family, the children, and their whole appointment
history permanently.

---

## The security check

This one matters more than any of the above:

```bash
npm run rls
```

The public key that the browser uses is visible to anyone who opens the
JavaScript in devtools. Everything the app enforces in React can be bypassed by
talking to the database directly with that key. What actually protects patient
records is row-level security inside Postgres.

This script connects using exactly that key and tries to read every table. It
must report that all of them return nothing. If any check fails, do not deploy
anything — send me the output.

You can also test the maintenance job — the one that frees abandoned slots and
deletes records past their retention period. Use whatever you put in
`CRON_SECRET`:

```bash
curl -H "Authorization: Bearer any-random-text-will-do" http://localhost:3000/api/cron/maintenance
```

---

## If something breaks

**`/book` says it cannot load appointment types** — the app is not reaching the
database. Check the three values in `.env.local`, then stop the dev server and
start it again. Next.js only reads that file at startup.

**Sign-in says invalid credentials** — re-run the `create-admin` command. If it
says the user already exists, delete that user in the dashboard under
**Authentication → Users** and run it again.

**You sign in but see nothing / get bounced** — the auth user exists but the
`profiles` row does not. `create-admin` creates both together; if it was
interrupted, delete the user in the dashboard and re-run it.

**No times ever appear on `/book`** — check the date is at least two days out
and is not a Sunday. If still nothing, open **Table Editor → clinic_settings**
and confirm there is one row with `opening_hours` filled in. If that table is
empty, the seed did not run — re-paste the last section of
`exports/bootstrap.sql`.

**"You already have a pending request"** — not a bug. Two outstanding pending
requests per mobile number is the limit. Either confirm one on `/staff`, or use
a different 10-digit number starting with 6–9.

**Starting over** — in the SQL Editor run `drop schema public cascade; create
schema public;`, then paste `exports/bootstrap.sql` again and re-run
`create-admin`. You will also need to delete the old user under
**Authentication → Users**, since that lives outside the `public` schema.

---

## Going fully offline later

If you would rather run the database on your own machine, install **Docker
Desktop**, then:

```bash
npm run db:start
```

It prints a local URL and keys — put those in `.env.local` instead of the cloud
ones. Then:

```bash
npm run db:reset
```

That applies all the migrations and the seed automatically. `npm run db:stop`
shuts it down. Nothing else about the walkthrough changes.
