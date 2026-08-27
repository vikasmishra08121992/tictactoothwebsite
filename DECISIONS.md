# Decisions, assumptions, and compliance flags

This file tracks judgement calls made while building this mockup, and
everything that needs client or legal sign-off before this design becomes a
real site. Nothing on this list has been silently decided — it's flagged
here specifically so it isn't missed.

## Legal / compliance — needs review before launch

- **No analytics or tracking scripts are included, and none should be added
  without legal review.** DPDP Act 2023 §9 restricts behavioural tracking,
  profiling, and targeted advertising directed at children, and processing a
  child's data requires verifiable parental consent. If the client wants
  usage analytics, it needs to be scoped (aggregate-only? cookieless? consent
  gated?) with a lawyer, not dropped in as a standard GA/Meta pixel.
- **Real child imagery** (face, name, before/after) is used nowhere on this
  site, per the brief's hard rule. If the client wants to add any in future,
  it requires **signed parental consent** per image, tracked outside this
  codebase.
- **Reviews and testimonials**: the placeholder reviews on `/reviews` and
  Home are shape/length placeholders only. Real reviews, and any future
  before/after content, need to be checked against **Dental Council of India
  advertising norms** before publishing — no comparative claims ("best in
  Ahmedabad"), no outcome guarantees.
- **No medical/outcome claims are made anywhere** — no "painless," no
  guarantees. Where copy describes what a child might feel, it's marked
  `[CLINICAL REVIEW REQUIRED]` and needs sign-off from the treating dentist,
  not a copywriter.
- **Privacy notice** (linked from the booking flow's consent step) is a
  placeholder. It needs to be drafted to DPDP Act 2023 §9 requirements
  specifically — what's collected, why, retention period, and how a parent
  can request deletion.
- **18-year-old patients booking for themselves** sit outside the
  children's-data consent regime the booking flow is built for. The current
  flow always asks for parent/guardian consent. Whether an 18+ self-booking
  path is needed, and what consent it should collect instead, is a legal
  question for the client — **not implemented** in this mockup pending that
  answer.

## Content still needed from the client (marked `[PLACEHOLDER]` / `[CONFIRM]` throughout)

- Doctor's name, MDS credential detail, and Gujarat Dental Council
  registration number (`/meet-the-doctor`, Home).
- All statistics, years in practice, patient counts, and any awards.
- Real Google reviews, with permission to publish (`/reviews`, Home).
- Wheelchair access details for entrance, treatment rooms, and washrooms
  (`/special-needs`, `/contact`).
- Specific list of conditions the team has direct experience with (autism,
  ADHD, Down syndrome, cerebral palsy, sensory processing differences, etc.)
  — currently a placeholder bullet on `/special-needs`.
- The general anaesthetic pathway — delivered on site or by referral, and
  to which facility (`/comfort-and-sedation`, `/treatments/general-anaesthesia`).
- Whether whitening is offered at all, from what age, and by what method
  (`/treatments/teeth-whitening` — currently entirely `[CONFIRM]`).
- Whether a Gujarati/Hindi language toggle is required in the header — stubbed
  as a future addition, not built.
- Clinic phone number, WhatsApp number, and exact timings — currently
  placeholder values throughout (`tel:+919000000000` / a placeholder wa.me
  link).
- Parking availability and directions (`/contact`, Home).

## Signature mechanisms removed at the client's request

Recorded together because the cumulative effect is larger than any single
decision. Across two rounds of review, four of the brief's eight signature
mechanisms have been dropped:

- **A — the Grown-ups / Kids dual register.** The brief called it "the
  headline idea; no competitor does it."
- **B — Calm mode.** The brief said to "prioritise this over anything
  theatrical", and it was the *functional* proof of the special-needs
  positioning: the Special Needs page now describes sensory-friendly care,
  but the site itself no longer demonstrates it. Worth knowing that the
  removed toggle also auto-engaged on `prefers-reduced-motion`. That OS
  setting is still honoured in CSS, so motion-sensitive visitors are not
  worse off — but the palette and density no longer adapt, and there is no
  longer a visible control a parent can hand to their child.
- **C — the literal 3×3 tic-tac-toe treatments board.** Dropped as a
  consequence of showing all 18 treatments in one list rather than nine plus
  a "more" section. The game mechanic now survives only on the 404 page.
- **D — the First Visit walkthrough.** The brief called it "the highest-value
  page on the site" and "the anxiety-killer".

What remains distinctive: the two named treatment rooms, the Special Needs
page and its downloadable social story, the No Cavity Club made real, the
Growing Up Smiling milestone rail, and the playable 404. That is still well
ahead of the competitor set, but the site is now closer in *structure* to a
conventional clinic site than the brief originally set out to be. Flagged
once here rather than repeatedly; the decisions are the client's to make.

The First Visit page's photography and step order were not lost — they now
live in `lib/content/social-story.ts`, which is self-contained.

**Fees & Payment has also been removed** at the client's request. The brief
listed transparent ₹ ranges as a parent need, and price is one of the things
a parent most often leaves a clinic site to go and find elsewhere — so it is
worth confirming the intent is "no published prices at all" rather than
"not until we have real figures". If it is the latter, the page can come
back; the fee list is in this file's git history. Braces & clear aligners was
the one treatment whose FAQ quoted a price, and that answer now points at the
consultation instead of a dead link.

## Design/engineering judgement calls made

- **Redundancy removed in the same pass:** seven near-identical closing
  call-to-action blocks collapsed into one `ClosingCta` component; the footer
  cut from ten links (all duplicating the header) to six that are genuinely
  footer-specific; and seven dead fields deleted from the content layer
  (`doctor.photoAlt`, `doctor.yearsPractising`, `rooms.ceilingMuralAlt`,
  `rooms.ceilingMuralSrc`, `site.email`, `site.whatsappDisplay`,
  `treatments.bespoke`) along with the now-unused `footerNav` export.

- **The supplied "SVG" logo is not a vector.** `TIC TAC TOOTH SVG.svg` is a
  669 KB file containing a single 1254×1254 base64 PNG plus a separate
  luminance mask, wrapped in an SVG with one rectangular clip path. There is
  no vector path data in it at all. It has been composited to a transparent
  PNG at `public/images/brand/logo.png` and is used as the real brand mark,
  with Next/Image deriving the responsive sizes — but **a true vector master
  is still outstanding** and should be requested. Without one the logo cannot
  be scaled for print or signage, or recoloured for single-colour use.
- **Brand colours are now sampled from that artwork**, replacing the
  approximations the brief started from — e.g. coral is `#FD8376` not
  `#F4736B`, and the tooth outline is a teal `#38A8AF` rather than a cyan.
  The one deliberate exception is `--ink`: the logo's own grid rule is a
  lighter `#355C8C`, but ink doubles as the body-text colour where the darker
  `#1D3A5C` earns 10.8:1 on cream instead of 6.2:1.
- **The mascot is drawn as SVG, and omits the raised fist.** The entrance
  mural shows the character with a fist raised. At the sizes used on this
  site a drawn fist consistently read as a lollipop or a magnifying glass, so
  the heroic read is carried by the cape, crown and logo shield instead. The
  production mascot should be properly vectorised from the mural by an
  illustrator — fist included — and dropped in to replace
  `components/mascot/mascot.tsx`. Four poses are wired up and used
  (hero / calm / brushing / sleeping).
- **The Space room has no photograph**, so it renders as a designed
  starfield stand-in rather than a grey box, with the glowing disc standing
  in for the backlit ceiling mural. It is the top item on the reshoot list.
- **Accessibility is verified, not assumed.** `npm run a11y` runs axe over
  every route in both Calm-mode states and currently reports zero violations
  against WCAG 2.2 AA. Re-run it before any handover — several of the fixes
  it caught were invisible by eye (ids containing spaces silently breaking
  `aria-labelledby`, `gridcell` without a `row` parent, ten pages with no
  `<h1>`). Adding new UI without re-running it will regress this.
- **`text-crimson` is not usable on ink** (3.0:1). The Dental Emergency
  eyebrow uses `blush` instead, which carries the same alarm at 6.8:1. Worth
  knowing if the emergency page is ever restyled — that page above all others
  has to be readable.

- **Register toggle scope**: limited to Home, First Visit, Our Space, and No
  Cavity Club, per the brief's explicit "four pages only." Every other page
  has a single fixed register appropriate to its audience (e.g.
  Treatments are inherently parent-register; Teens and Special Needs are
  their own dedicated registers).
- **Treatments board**: the brief's tic-tac-toe navigation is a real 3×3
  grid, so it holds the 9 highest-search-intent treatments rather than
  forcing all 15 items into it. The remaining 6 are listed plainly below the
  board.
- **Booking flow submits nowhere** — it's a fully validated, working client-side
  wizard with a designed success state, but no backend exists. This is
  intentional per the brief ("no backend, no auth, no API calls").
- **Certificate generator and brushing chart** on `/no-cavity-club` are
  visually real and interactive (typed name renders live on the certificate
  preview; brushing days toggle) but "Download" actions show a toast
  explaining this is a mockup, rather than silently doing nothing.
- **Social story download** (`/special-needs`) behaves the same way — the
  page grid and captions are real content, the PDF export is mocked.

---

## Application phase — architecture and compliance decisions

Everything above concerned a mockup that stored nothing. From the point the
booking form writes to a database, the compliance notes stop being
hypothetical. These are the decisions that make persistent children's records
defensible, and the reasoning behind each.

### Two defects found in review, and fixed

**The audit log was a shadow copy of every patient record.** The trigger wrote
the whole row into `audit_log` on insert and delete, so `erase_family` did not
erase — it deleted the family and cascade-deleted the children, while every one
of those deletions copied the child's name and date of birth into a table the
erasure never touched. A parent exercising their §9 right would have had their
data moved, not removed, and the retention purge had the same hole.
`0007_audit_redaction.sql` records *which columns* changed on patient tables
and never their values, and redacts any rows the earlier version already wrote.

**Staff could delete patient records directly.** `families_staff_all` granted
`for all`, which includes DELETE — so a receptionist could remove a family
through the ordinary API, bypassing `erase_family`'s admin check and the
recorded reason that makes an erasure demonstrable. No policy now grants DELETE
on `families`, `patients` or `appointments`; `erase_family` is SECURITY DEFINER
and is the only route.

### Anon has zero table access — including for harmless data

The booking form needs the list of treatment types and the marketing pages need
the clinic's phone number. Neither is sensitive, and a `select` policy for
`anon` on those two tables would have been the obvious thing to write.

It was not written. The entire security model rests on one sentence being
absolutely true: *the anon key reaches no table.* Once there are two exceptions
"because they're harmless", every later reviewer has to work out which tables
are on the list, and the sentence stops being checkable. `0005_public_config.sql`
exposes both through narrow SECURITY DEFINER functions with explicit column
lists instead. The column list is the load-bearing part: `select *` would mean
that adding an internal field to `clinic_settings` later silently publishes it.

`get_public_config()` deliberately omits the rate-limit ceilings and pending
TTL. Publishing the limits of a throttle to the people it throttles is free
reconnaissance.

### Availability is fetched, never listed

The mockup offered a hardcoded list of times. Those times knew nothing about
opening hours, closures, lead time, treatment duration or what was already
booked, so the form would cheerfully offer a slot that did not exist and the
parent found out after filling in the rest of it. Times now come from
`get_available_slots`, which returns free times only — never appointment rows,
because a list of when children are in the building is exactly the enumeration
we must not hand out.

### Date of birth, not age

The form asked for age and the schema stored it. An age is a fact that is wrong
within a year, and a stale one silently corrupts clinical context and recall.
`patients.date_of_birth` is stored and age is derived at read time;
`appointments.age_at_booking` keeps what the parent stated at the time, as an
immutable record.

### Online bookings never attach to an existing family

A mobile number typed into a public form is an unverified claim. Matching on it
would hand one family's children and visit history to anyone who guessed the
number. Every online booking creates a fresh provisional family; reception
merges duplicates from the records browser while looking at both.
`merge_families` is the other half of that decision — without a merge path the
rule just produces duplicates nobody can reconcile. The source family is not
deleted; `merged_into_id` leaves a trail so a mistaken merge is recoverable.

### IP addresses are hashed, never stored

Rate limiting needs to count requests per device. It does not need an address
that identifies a household, attached to a child's booking. A salted hash
counts identically and identifies nobody if the table leaks. The salt is
`IP_HASH_SALT`, deliberately separate from `CRON_SECRET`: rotating the cron
credential should not silently reset every rate-limit window.

### The cron endpoint refuses to run without a secret

`/api/cron/maintenance` returns 500 rather than proceeding if `CRON_SECRET` is
unset. An open URL that deletes patient records is worse than a job that never
fires — and a job that never fires is itself a compliance failure, not just
housekeeping, because retention only holds if the purge actually runs. The
endpoint returns counts and a non-200 on error rather than swallowing problems.

### `npm run rls` is the test that matters

The anon key ships in the client bundle and can be read out of the JavaScript.
Everything written in React or in a server action is bypassable; RLS is not.
`scripts/rls-probe.mjs` talks to the database with the key an attacker would
use, asserts that every table returns nothing and that only the three intended
public functions are callable, and exits non-zero otherwise. It runs on every
deploy because RLS regressions are silent — nothing errors, nothing looks
broken, the data is simply readable.

### Still outstanding before go-live

- **Legal sign-off on `/privacy`.** The page is a structural draft written so a
  lawyer can check it against what the software genuinely does. Its bracketed
  placeholders — retention period, named processors, the registered Data
  Fiduciary — are decisions for the clinic and its lawyer, not gaps to fill
  with plausible text.
- **Supabase Pro for production.** Free projects pause after inactivity and
  carry thin backup retention. Load is not the issue; a paused booking calendar
  and weak backups on children's records are.
- **WhatsApp**: Meta Business verification, a BSP, and template approval. The
  adapter is built and flagged off; email ships first.
- **Data processing agreements** with the hosting, email and messaging
  providers named in the privacy notice.
- **The 18-year-old self-booking consent branch**, deferred as a legal
  question, becomes live now that real consent is recorded.
- **Who holds the first admin account**, and how the temporary password is
  handed over.

### Two more retention gaps, found by checking the code against the notice

Writing `/privacy` meant stating plainly what the software does, and two claims
turned out not to be true yet.

**The rate-limit ledger kept mobile numbers forever.** `booking_attempts`
stores the parent's mobile in the clear so the limiter can count pending
requests per number. The count only looks back an hour; the row was kept
indefinitely, and it has no foreign key — by design, since it must accept rows
for bookings that were rejected and never became a family. So it survived
`erase_family` completely: a parent could ask for erasure, be told it was done,
and leave their number behind in a table nobody had thought about.
`0008_ledger_retention.sql` trims attempts after seven days and makes
`erase_family` clear the erased family's own attempts.

**`notification_log.error` holds whatever the provider said went wrong**, which
routinely includes the recipient's address. Rows attached to an appointment
cascade correctly, but a failed send for a booking that was never created has
nothing to cascade from. Orphans are now purged after thirty days.

### The erasure log keeps a reason, and the notice says so

`erase_family` stores the free-text reason a member of staff types. It is the
one field in that log entry that could contain a name. Removing it would make
the erasure less demonstrable, which is the entire point of keeping the entry —
so it stays, the erase dialog tells staff not to put names in it, and the
privacy notice says a reason is kept rather than claiming the entry holds
nothing personal. An accurate claim the clinic can stand behind beats a cleaner
one it cannot.

### The marketing chrome moved out of the root layout

Public pages now live in `app/(site)/`, which owns the header, footer, sticky
action bar and the `<main>` landmark. Previously the root layout wrapped
everything, so the staff sign-in page rendered a second `<main>` inside the
first — three axe violations — and showed a receptionist the parent-facing
navigation and an "Emergency" bar while they were trying to log in. URLs are
unchanged; route groups do not appear in paths.

`app/not-found.tsx` handles unmatched URLs globally and therefore sits outside
that group, so the frame is a component (`components/layout/site-chrome.tsx`)
used by both. One definition, no drift.

### The SQL has now been executed, and it was wrong in two ways

All migrations were applied to a real Supabase project via the CLI's `--db-url`
flag against the IPv4 pooler (the direct `db.<ref>.supabase.co` host is
IPv6-only and unreachable from this machine). The schema, RLS, availability
engine, booking, consent and audit redaction are all verified working
end-to-end. Two defects surfaced that no amount of reading had caught.

**`is_admin()` returned NULL, so its guard did nothing.** `auth_role()` returns
NULL with no signed-in user, and `null = 'admin'` is NULL rather than false.
In an RLS policy that is safe — Postgres treats a NULL `USING` result as false
— but in procedural code `not NULL` is NULL, `if NULL then` never fires, and
`erase_family` ran straight past its administrator check for an anonymous
caller. `is_staff()` was accidentally safe because `x is not null` cannot
return NULL; that was luck, not design. Both now `coalesce` at the source.
The general rule: a three-valued function must never be the entire condition
in a guard.

**`revoke ... from public` revoked nothing from `anon`.** Supabase ships
`alter default privileges in schema public grant all on functions to anon,
authenticated, service_role`, so every function got an explicit `anon` grant at
creation. Revoking from the PUBLIC pseudo-role left that untouched, leaving
`expire_stale_pending`, `purge_expired_records` and `erase_family` callable
with the key that ships in the browser bundle — and `purge_expired_records`
deletes families in bulk. `0009_guard_hardening.sql` revokes by name and
flips the default so anything added later is denied unless granted deliberately.

Both were found by `npm run rls` on its first run against a real database, and
neither was visible by inspection. That script earns its place in the deploy
checklist.

### Every online booking would have failed, for a reason the schema hid

`request_appointment` built its reference with `gen_random_bytes(4)`, which
comes from pgcrypto. `create extension if not exists pgcrypto` in 0001 is a
silent no-op on Supabase because pgcrypto is already installed — into the
`extensions` schema, not `public`. The function pins `search_path = public` so
that nothing can shadow its tables, which meant `gen_random_bytes` was not on
the path and every booking raised *function does not exist*.

This hid well: `gen_random_uuid()`, used for every primary key in the schema,
has been a Postgres **built-in** since 13 and needs no extension, so the tables
all worked and the schema looked healthy.

Adding `extensions` to the search_path would have fixed it while loosening the
pin. Dropping the dependency is better — `0010_booking_reference.sql` uses the
built-in.

The same migration fixes a latent problem alongside it: the reference was six
hex characters on a `unique` column with no retry. Twenty-four bits means a
collision becomes more likely than not at about 4,800 appointments — inside a
year for a clinic seeing thirty patients a day — surfacing to parents as
random booking failures with nothing in the code to explain them. Now eight
characters plus a bounded retry, with the unique constraint left as the final
arbiter under concurrency.

---

## Portal redesign and calendar completion

The staff and admin portals were functional but thin: a top bar borrowed from
the marketing site, one calendar view, and three admin pages that each invented
their own heading. Rebuilt as a tool rather than a set of pages.

### Two bugs that made the calendar look broken

**Paging to another week showed an empty grid.** The arrows moved a `useState`
anchor while the server had already fetched appointments for one specific week.
The columns changed, the data did not, and `router.refresh()` from the realtime
subscription refetched the *original* range — so it never self-corrected. View,
date and status now live in the URL, which means the range the server fetched
and the range the grid draws cannot disagree. It also makes a view shareable
("the 3rd looks busy" as a link) and survives a refresh.

**The week started on Sunday.** `startOfWeek` works in the runtime's local
zone; the result was then formatted as a UTC date key. On a machine set to IST,
local Monday 00:00 is 18:30 UTC *Sunday*, so the key came back a day early.
Only reproducible east of UTC — it would have looked correct to anyone testing
in Europe. All range arithmetic is now UTC-only, and the two helpers that had
the flaw were deleted rather than patched. **A date key is a label, not an
instant, and must never be round-tripped through a zoned Date.**

### What the calendar was missing

Day, month and list views; a reschedule UI (`rescheduleAppointment` existed in
`lib/scheduling/actions.ts` and nothing called it); a status filter; a current
time line; and side-by-side layout for overlapping appointments.

Day and week are one component with one column or seven. Month deliberately is
not a scaled-down week — at that scale nobody reads times, so cells show counts
and click through to the day. The list view exists because a time grid is the
wrong tool on a phone and the right tool for working through a backlog of
pending requests.

Status filtering happens in the database, not the browser. Sending every
cancelled appointment to the client and hiding it with CSS would ship
children's names the user asked not to see.

Reschedule lets staff pick any time rather than choosing from public
availability. Reception routinely needs to squeeze someone in, and a tool that
refuses is a tool people work around with a paper diary. The exclusion
constraint remains the arbiter of genuine clashes.

### Three defects the accessibility audit caught

**The time grid's ARIA was invalid.** `role="row"` requires `gridcell`
children, and a column of absolutely positioned blocks cannot honestly provide
them. Rather than fake the structure, the grid roles were dropped: the slots
are real buttons with real labels, navigated by a true roving tabindex that
moves DOM focus, so a screen reader reads the slot it is on.

**`opacity` on a card broke contrast inside it.** Merged family records were
dimmed with `opacity-70`, which multiplies through every descendant —
`text-ink/85` rendered at ~55% and failed. De-emphasis is now a recessed
background and a badge. Never dim a container that contains text.

**shadcn's `SelectTrigger` is 32px.** The same defect found earlier in Button,
from the same cause: upstream defaults assume a mouse. Fixed at the primitive
so no future Select can reintroduce it — this also silently fixed the public
booking form.

### Target size on a time grid

A 15-minute slot cannot be a 44px touch target: slot height *is* duration, so
forcing it would stretch a nine-hour day past 1500px. Density was raised so
slots clear the WCAG 2.2 AA minimum of 24px (2.5.8), and the 44px path is the
keyboard — arrows plus Enter — and the "New appointment" button, which is what
2.5.8's equivalent-control exception is for. The exemption is encoded in
`npm run responsive` with the reason, not left as an unexplained pass.

### Both audit scripts were reporting against the wrong routes

They signed in first, so `/auth/sign-in` redirected to `/staff` and the
calendar's violations were filed under the sign-in page — sending anyone
reading the report to the wrong file. Public routes are now audited before
signing in. `npm run a11y` and `npm run responsive` both pass clean across all
24 routes including the authenticated portal.

### `/admin` returned 404

There were three admin pages and no index, so the "Administration" nav had no
home. The overview now answers the two questions an administrator opens the
portal for — is anything waiting on a human, and is the clinic configured —
using counts only, never names: it is a landing page that may sit open on a
screen someone walks past.

### Every page opened at the previous page's scroll position

Reported as "each tab I open is already scrolled halfway", and reproducible in
one line: scroll to 1500px, click a nav link, land on the new page still at
1500px.

The cause was `html { scroll-behavior: smooth }` in `globals.css`. The App
Router resets scroll on navigation by calling `window.scrollTo(0, 0)`, and CSS
scroll-behavior applies to programmatic scrolls too — so the framework's
instant reset became an animation that the incoming render interrupted before
it arrived. Nothing errored; the page simply stayed where it was.

Removed rather than worked around. Nothing on the site needed it: there are no
in-page anchor links, and the skip link is better instant — a smooth-scrolled
skip link is slower and more disorienting for exactly the keyboard users it
exists for. A comment sits in its place so it does not get re-added.

Confirmed afterwards that the two behaviours worth protecting still hold:
forward navigation lands at the top, and the Back button still restores the
previous scroll position.

---

## Content pass — naming and depth

### The hospital is named, everywhere

Body copy referred to itself as "we", "us" and "the clinic" and almost never
said *Tic Tac Tooth*. The name appeared in page titles and meta descriptions —
the two places a visitor is least likely to read — and not in the sentence
under the headline. A parent arriving from a search result, a WhatsApp link or
a friend's screenshot could read a whole page without learning whose website
they were on.

`clinic.name` in `lib/content/site.ts` is now the single source of the name and
page copy interpolates it rather than typing it by hand, so it cannot drift
into "the clinic" on one page while the rest say something else. Every public
page now names the hospital in its opening paragraph, including the home page,
the emergency page and the footer.

### Detail, without inventing anything

The brief forbids inventing facts, and "make it more detailed" is exactly the
instruction under which invented facts appear. The rule applied throughout this
pass: **expand explanation, never invent fact.**

What was safe to expand — because it describes reasoning and process rather
than asserting anything verifiable:

- **For Parents** went from five one-paragraph answers to ten topics, each with
  a one-line answer visible while scanning and the full answer underneath. Four
  are new and were missing: what actually happens at a first visit, whether
  baby teeth matter, what to do in the first minutes of a knocked-out tooth,
  and what to do about a terrified child.
- **The No Cavity Club** badges had names and colours and nothing else — a
  child could not tell what to do to earn one and a parent could not tell what
  any of them measured. Each now says how it is earned and why it is worth
  earning, the second line aimed at the parent, because a reward scheme only
  works if the adult at home keeps it going between visits.
- **Growing Up Smiling** milestones described what happens at each age. They
  now also say what to do and what parents most often get wrong or worry
  about — this is the page someone reads at 11pm after noticing something at
  bedtime.
- **The home page trust bar** was four two-word labels, which reads as
  marketing. Each now explains what the thing means in practice.

What was not safe, and is marked instead: opening hours, phone number, parking,
wheelchair access, the doctor's name and qualifications, review text and
ratings, and what a completed No Cavity Club card earns.

### One claim caught in review

A draft of the trust bar described the sterilisation protocol appealingly —
"instruments in sealed pouches opened in front of you". Nobody had confirmed
that. It reads like copywriting and functions as a claim a parent may rely on
when choosing where to take their child, so it was replaced with what is
actually known plus a `[CONFIRM]` for the specifics. The reviews page briefly
claimed reviews were unsolicited and unedited, which is a statement about the
clinic's practices that nobody had verified either; it now says only that they
come from Google and links out so a parent can check.

### `npm run content`

The markers are the honest alternative to plausible copy, but 104 of them
scattered across 21 files are no use to a client as a to-do list. `npm run
content` walks the source and prints everything outstanding, grouped by who has
to resolve it:

| Owner | Items |
|---|---|
| Client — facts to supply | 49 |
| Dentist — clinical sign-off | 44 |
| Client — photography | 5 |
| Lawyer — legal sign-off | 3 |
| Client — real reviews | 3 |

Generated rather than hand-maintained, because a checklist updated by hand goes
stale the first time someone forgets and then quietly under-reports what is
still missing before launch.

### A competitor's name was in live public copy

The Our Space page opened with "Heeya asserts a child-friendly environment.
This is ours, photographed rather than described." That is the competitor named
in the original brief as the thing to diverge from — and it had ended up in the
client's own public copy, making a comparative claim the brief explicitly
forbids.

A literal find-and-replace would have produced "Tic Tac Tooth asserts a
child-friendly environment. This is ours", which is nonsense — the sentence is
built around a contrast with someone else. It now reads:

> Child-friendly is easy to claim and hard to show. This is Tic Tac Tooth,
> photographed rather than described — start at the door and walk in.

Same voice, no competitor, no comparative claim about any named practice.

**The stale exports mattered more than the source.** `tic-tac-tooth-mockups/`
is the folder the client actually looks at, and it still contained a rendered
screenshot of the competitor's name — plus `fees_*` and `first-visit_*`, two
pages removed at the client's request several rounds earlier. A source fix that
leaves the deliverable showing a competitor's name is not a fix. The deck has
been regenerated from the current site, `/privacy` added to `npm run shots`
(it had been built after the script's route list was last touched), and a
byte-level search across every file in the project — images included — now
returns zero occurrences.

Worth carrying forward: the screenshot deck is generated but not automatically
regenerated, so it silently drifts from the site. Regenerate it before any
client review rather than trusting what is in the folder.

