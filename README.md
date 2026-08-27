# Tic Tac Tooth

The website and booking system for Tic Tac Tooth, a paediatric dental hospital
in Maninagar, Ahmedabad.

It began as a design mockup and is now an application: parents book online,
requests land in a receptionist's calendar, and an administrator configures the
clinic from the browser. The public site and the design system are unchanged
from the approved mockup.

- [`DECISIONS.md`](./DECISIONS.md) — every architectural and compliance
  decision, the reasoning behind each, and what still needs client or legal
  sign-off.
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Supabase and Vercel setup, and the
  checks that must pass before a production deploy.

**This stores children's names, dates of birth and parents' contact details.**
That single fact drives most of the architecture — read `DECISIONS.md` before
changing anything under `supabase/` or `lib/supabase/`.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in from your Supabase project
npm run dev
```

Then open `http://localhost:3000`. Start at `/mockups` for an index of every
public screen.

Without Supabase credentials the public site still runs — the marketing pages
need no database, and the booking form says so and points at the phone and
WhatsApp instead. The staff portal returns 503, deliberately: it cannot
function without the database, and quietly letting someone in would be worse
than an error.

```bash
npm run build   # production build, zero TS errors expected
npm run shots   # captures every route at 390px and 1440px into /exports
npm run a11y       # axe audit, every route
npm run responsive # overflow + touch-target check at 390/768/1024/1440
npm run rls        # RLS probe — see below
```

`npm run rls` is the most important check in the project. The anon key ships
inside the client bundle, so anything enforced in React or a server action can
be bypassed; RLS cannot. The probe connects with the key an attacker would use
and asserts that every table returns nothing and that only the three intended
public functions are callable. It runs on every deploy because RLS regressions
are silent — nothing errors, the data is simply readable.

`npm run a11y` walks all 20 routes against `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` and
`best-practice`. It currently reports **zero violations**, and writes a
per-node JSON report to `exports/a11y-report.json` for triage when it doesn't.

`npm run responsive` walks the same routes at all four breakpoints looking
for horizontal overflow and interactive targets under 44px — the two layout
defects that are hardest to catch by eye. It also currently passes clean.
Inline links inside prose are exempt from the target rule.

`a11y` and `responsive` cover public routes by default. Set `A11Y_STAFF_EMAIL`
and `A11Y_STAFF_PASSWORD` for a **dev-project** account to include the calendar
and admin forms — the calendar grid is the likeliest place to lose the AA
standard the rest of the site holds. Without credentials they say what they
skipped rather than reporting a clean sweep over fewer routes.

`shots`, `a11y` and `responsive` start a dev server themselves if one isn't
already running.

## Screen map

| Route | Notes |
|---|---|
| `/` | Home |
| `/our-space` | Photo tour of both treatment rooms, play gym, reception |
| `/treatments` | All 18 treatments in one list, teen items tagged |
| `/treatments/[slug]` | Treatment detail — 3 bespoke, rest templated |
| `/special-needs` | Special Needs & Inclusive Care, incl. social story download |
| `/comfort-and-sedation` | Tell-show-do, laughing gas, general anaesthesia |
| `/no-cavity-club` | Brushing chart, badges, certificate generator |
| `/growing-up-smiling` | Height-chart-style age 0–18 milestone rail |
| `/meet-the-doctor` | Credentials |
| `/emergency` | High-contrast, call-first |
| `/for-parents` | Brushing, diet, teething, thumb-sucking FAQ |
| `/book` | Six-step booking wizard, WhatsApp equal-weight |
| `/contact` | Location, timings, accessibility |
| `/reviews` | Reviews (placeholder content, shape only) |
| `/mockups` | Index of every screen |
| 404 | Playable tic-tac-toe against the mascot |

## Signature mechanisms built

Four of the brief's signature mechanisms have been dropped at the client's
request across two rounds of review — **A** (the Grown-ups/Kids dual
register), **B** (Calm mode), **C** (the literal 3×3 tic-tac-toe treatments
board) and **D** (the First Visit walkthrough). See DECISIONS.md for what
that costs and what remains.

What survives: **E** the downloadable social story, **F** the No Cavity Club
made real, **G** the height-chart milestone rail, the two dedicated
treatment rooms, the Special Needs page, and the playable tic-tac-toe 404 —
which is now the only place the game mechanic still appears.

## Design tokens

Single source of truth: CSS custom properties in `app/globals.css`, mapped
to Tailwind utilities via `@theme`. No hard-coded hex anywhere else in the
codebase — every brand colour is a token (`ink`, `cream`, `coral`,
`crimson-btn`, etc.), and every bright token has a darkened `*-text` variant
for use as text on `cream`.

Three rules keep the bright palette legible. Worth knowing before adding UI:

- **Secondary text is `text-ink/85`.** Not `text-ink/60` and friends — ink
  only clears 4.5:1 on cream down to about 75% opacity. A solid muted grey
  was tried first and worked on cream, but failed once brand colours became
  section grounds. Ink at 85% adapts to whatever it sits on.
- **On saturated brand fills, use `text-ink`**, not that colour's `*-text`
  variant. Those variants were derived for use *on cream* and land around
  3.6:1 when placed on their own colour.
- **`sage-deep`** exists because full-strength `sage` is a mid-tone that
  fails against both cream (3.2:1) and gold (2.0:1).

Colour-blocking is the main brightness lever: `Section` takes a `tone`
(`mint`, `blush`, `lavender`, `lime`, `gold`, `tangerine`, `ink`,
`midnight`, `crimson`, `wash`…) and the brand fills are used at full or
near-full strength as grounds rather than as 15–25% tints. Ink clears 7:1 or
better on all of them.

## Motion

Entrance animation is CSS-only (`.animate-rise`, `.stagger`) and uses
`animation-fill-mode: backwards`, so an element's natural un-animated state
is the *visible* one. If animations never run — reduced motion, an old
browser, a failed stylesheet — content is simply there. Nothing is ever
hidden waiting on a callback. `prefers-reduced-motion` collapses all
durations to near-zero in `globals.css`.

## What's mocked vs real

- **Real**: all copy (length-matched placeholders where facts are
  unconfirmed, never lorem ipsum), all layout and interaction, the booking
  wizard's client-side validation and state, the certificate generator's
  live preview, the brushing chart's toggle state, the 404 game's actual
  win/lose/draw logic against the mascot.
- **Mocked**: "Download" buttons on the certificate/social story show a toast
  rather than producing a real file, and the embedded map is a placeholder
  panel. Booking is no longer mocked — it writes to the database and appears
  in the calendar.
- **Real photography**: the jungle room, play gym, reception, entrance, and
  No Cavity Club mural are the client's own supplied photos, not stock. See
  [`public/images/README.md`](./public/images/README.md) for the reshoot
  priority list and remaining placeholder slots (the Space room has no
  photo yet).

## Tech

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4 +
shadcn/ui (Base UI primitives, restyled) + `lucide-react`.

Supabase for Postgres, auth and realtime; Vercel for hosting and the hourly
maintenance cron. Marketing copy still lives in typed modules under
`lib/content/`; clinic details, treatment types, opening hours and closures
come from the database so reception can change them without a deploy.

```
app/(site)/     public pages — the marketing chrome lives here, not in the
                root layout, so the staff sign-in does not inherit it
app/staff/      receptionist: the calendar and records
app/admin/      configuration, treatment types, closures, staff, records
app/api/cron/   pending expiry and retention purge
lib/scheduling/ availability engine and appointment actions
lib/booking/    the public booking path
lib/records/    patient and family records
supabase/       migrations, in order, and configuration-only seed data
```
