# Wedding Mantra Films — Smart Package Builder + Admin Dashboard

A working demo covering the client-facing side of the CRM brief **and** an
Admin Dashboard for running the business day to day — all using the black/
gold/white glass-morphism theme, and all working entirely offline (no
Supabase project required to try it).

## Admin Dashboard (`/admin`)

Linked quietly from the landing page footer. Covers, from your spec:

- **Lead pipeline** — Kanban board across the 11 real booking stages (New
  Lead → Follow-up → ... → Delivered → Closed). Click any card to open its
  detail panel and move it forward.
- **Global search** — press `/` or click the search bar to filter every
  lead by name, phone, email, occasion, package, or status.
- **Calendar** — a real month-grid calendar; days with a scheduled shoot
  are marked, click a day to see who's booked.
- **Revenue analytics** — a 6-month bar chart of quoted value, plus Total
  Leads / Upcoming Shoots / Total Quoted Value / Pending Payments stat
  cards.
- **Activity timeline** — every lead creation and status change, newest
  first, across your whole pipeline.
- **Team assignment & delivery tracking** — each lead's detail panel has
  editable Assigned Photographer / Cinematographer / Editor fields, a
  Delivery Status, and a Google Drive delivery link.
- **Reports & exports** — an Export CSV button dumps every currently
  filtered lead (respects your search) to a spreadsheet-ready file.

All of this reads from the same lead storage the client-facing flows
already write to — so every quote submitted through `/packages` or
`/builder` shows up here automatically, no backend required.

## Other enterprise touches included

- **Error boundary** — one broken component shows a recovery screen
  instead of a blank page.
- **Lazy loading** — every page loads on demand instead of all at once.

## What's genuinely not included here

Straight from your spec, but needs infrastructure or business decisions
this chat can't provide: **Payments** (needs your live Razorpay account),
**Google Calendar sync** (needs Google OAuth setup), **role-based access /
audit logs** (needs real user accounts via Supabase auth), **AI features**
(quotation, lead scoring, follow-up — needs a trained model and real usage
data), **native mobile app**, **multi-branch / vendor / inventory**
(these depend on how your business is actually structured). Also not yet
built: Portfolio/Gallery/Testimonials/Client Portal marketing pages,
coupon system, notification system, and package templates — all
straightforward to add whenever you want them prioritized.

## Package-first flow (`/packages`) — the simple path

1. Choose a package (Bronze ₹39,999 / Silver ₹59,999 / Gold ₹79,999 /
   Platinum ₹99,999) — numbers taken directly from your rate card.
2. See what's included, optionally switch Silver/Gold/Platinum to the
   **Premium Bundle** (Both Side Coverage) pricing, and add extras.
   **Removing an included item never lowers the price** — it's there so the
   client can note what they don't need, not to get a discount. Only
   additions change the total.
3. Enter contact details.
4. Download the Quotation/Invoice PDF or send straight to WhatsApp.

All package details live in `src/config/packages.js` — edit the `includes`
list or prices there whenever your rate card changes.

## Settings page (`/settings`) — edit prices & business info without code

Linked quietly from the landing page footer ("Studio Settings"). Everything
editable here takes effect across the whole site immediately:

- **Business Info** — name, tagline, phone, WhatsApp number, Instagram,
  website, email, address.
- **Package Pricing** — price and bundle price for each of the four
  packages, delivery days, and the "what's included" list (one line per
  item, in a text box).
- **Add-On Pricing** — every photographer/cinematographer/drone/album/
  wedding film/reel/extra price used by both flows.
- **Custom Builder Rates** — the base day rate, duration multipliers,
  advance percentage, and the Basic/Premium/Luxury recommendation bands
  used only by the fully-custom builder.

Changes save automatically to this browser (no "Save" button needed) and
persist across refreshes. A **Reset to Defaults** button restores the
original values from the code if something goes wrong.

**Note on language:** kept as JavaScript rather than converting to
TypeScript. For a single-developer, frequently-changing project like this
one, TypeScript's main benefit (catching type errors across a large team
codebase) matters less than staying quick to modify — and converting now
would touch every file for no functional change. Worth revisiting if you
bring on another developer later.

## Fully custom flow (`/builder`):
  1. Contact details
  2. Occasion
  3. Wedding date known / not known (marks **Future Leads** automatically)
  4. Number of event days (1–10)
  5. Per-day ceremony, duration, venue, timing, guest count, and service
     toggles (photography, cinematography, drone, LED wall, live streaming,
     reels, wedding film, album, notes)
  6. Add-ons: photographers, cinematographers, drone, album, wedding film,
     reels, and optional extras
  7. Live price calculator with itemised line items, grand total, 50%
     advance, remaining balance, and a Basic/Premium/Luxury recommendation
  8. Generate: downloadable **Quotation PDF** and **Booking Invoice PDF**
     (both include Terms & Conditions), plus a **Book on WhatsApp** button
     that opens a pre-filled message to `9288277233`.
- Every submission is saved as a "lead" via Zustand + `localStorage` so
  nothing is lost — and the same code path also attempts a Supabase insert
  whenever Supabase is configured (see below).

## What's *not* built yet

This is the client-facing builder only — not the full CRM. Not included:
admin dashboard, revenue analytics, team assignment, follow-up reminders,
coupons, email notifications, or the Supabase auth/RLS setup. The code is
structured so those can be added on top:
- `src/lib/supabaseClient.js` has the exact `leads` table schema as a SQL
  comment, and a working `insertLeadToSupabase()` call.
- `src/store/useLeadsStore.js` is the seam where an admin dashboard would
  read from — swap its `leads` array for a Supabase query once you're
  building that piece.

## Pricing

Two config files, two purposes:

- **`src/config/packages.js`** — the four package base prices and what's
  included in each. Already filled in with your real rate card.
- **`src/config/pricing.js`** — add-on prices (photographers, drone,
  albums, reels, extras) used by both flows, plus the recommendation bands
  for the fully-custom flow. **These are still placeholders** — replace
  them with your real add-on rates whenever you have them; nothing else
  needs to change.

## Running it locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Connecting Supabase (optional, for now)

1. Create a project at supabase.com.
2. In the SQL editor, run the `create table leads (...)` statement found as
   a comment in `src/lib/supabaseClient.js`.
3. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` from your project's API settings.
4. Restart `npm run dev`. New submissions will now sync to Supabase in
   addition to localStorage.

## Deploying to Netlify

A `netlify.toml` is included, so Netlify should auto-detect everything —
but if a deploy fails at "Initializing," it's almost always one of these:

- **Connected a GitHub/GitLab repo?** In Site settings → Build & deploy →
  Build settings, confirm: Build command = `npm run build`, Publish
  directory = `dist`. The `netlify.toml` sets this automatically once it's
  committed to your repo, so make sure it's actually pushed.
- **Dragged a folder onto Netlify's deploy page?** That method needs the
  *already-built* `dist` folder, not the project source. Run
  `npm install && npm run build` on your machine first, then drag the
  resulting `dist` folder (not this whole project folder).
- **Still failing?** Open the failed "Initializing" step in the deploy log
  (click the `›` arrow to expand it) — that reveals the actual error
  message, which is usually a missing dependency or wrong Node version.
  `.nvmrc` here pins Node to version 20 to avoid that second one.

## Deploying to Vercel

Push this folder to a GitHub repo, then import it in Vercel — it's a
standard Vite app, no special build config needed. Add the same two
`VITE_SUPABASE_*` environment variables in the Vercel project settings.

## Notes on PWA support

`public/manifest.webmanifest` is in place with the brand colors. For full
installability, add real icon files (192×192 and 512×512 PNGs) and
reference them in the manifest, then add a service worker (e.g. via the
`vite-plugin-pwa` package) — left out here to keep this demo focused on the
package builder itself.
