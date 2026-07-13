# Founding waitlist — kids' western boot

A single static page that captures a qualified waitlist signup (email + child's size + price intent + what-matters-most), A/B tests the headline, and writes each signup into Klaviyo as a profile with consent. No database, no server to run — Netlify serves the files and one serverless function talks to Klaviyo.

```
index.html            the page (structure + copy)
styles.css            warm-leather palette, denim accent, stitch motif
main.js               A/B headline assignment + form submit
netlify/functions/
  subscribe.js        upserts profile properties + subscribes to Klaviyo
netlify.toml          Netlify config
```

## Launch checklist — all done (launched 2026-07-08 at [pardnerboots.com](https://pardnerboots.com))

- ~~**Brand name**~~ — done: set to **Pardner Boots** (nav, footer, `<title>`, and the `styles.css` header). Use bare "Pardner" only where in-sentence context calls for it.
- ~~**Hero render**~~ — done: `hero.jpg` (tall-shaft caramel boot) in the hero, `toe-box.jpg` (top-down) in the fix section.
- ~~**Contact email**~~ — done: the error message in `main.js` (`showError`) links to **howdy@pardnerboots.com**.
- ~~**Domain**~~ — done: `pardnerboots.com` (A `@` → `75.2.60.5`, CNAME `www` → `pardner-boots.netlify.app` at GoDaddy). **DNS stays at GoDaddy, additive records only** — email MX and Klaviyo sending-domain records live there; never switch nameservers.

## Klaviyo setup (one-time) — done 2026-07-08

1. ~~Create a **separate Klaviyo account**~~ — done (separate Pardner Boots account, fully independent of any other brand's stack).
2. ~~Create a **List** for the founding waitlist~~ — done: List ID **`VUATXv`**.
3. ~~Create a **Private API key**~~ — done: custom key scoped to **List + Profiles + Subscriptions** (full access), nothing else.
4. **Opt-in mode:** double opt-in (Klaviyo default; the page's success copy assumes it). The confirmation email is sent from the branded sending domain **`send.pardnerboots.com`** (verified + activated in Klaviyo → Settings → Email → Domains) — without it, confirmations land in spam. Switch the list to single opt-in only if confirmation rates look weak with real traffic; that also means changing the success message in `index.html`.

**Testing signups:** use real, distinct mailboxes. Klaviyo auto-suppresses plus-addressed emails (`you+test@…`) at profile creation ("User Suppressed"), and suppressed profiles never receive the opt-in confirmation.

## Environment variables — set in Netlify (done)

```
KLAVIYO_PRIVATE_API_KEY = pk_xxxxxxxxxxxxxxxxxxxxxxxx   (marked "secret" in Netlify)
KLAVIYO_LIST_ID         = VUATXv
```

The private key lives only in the function's environment — it is never exposed to the browser. That's the whole reason the call is routed through the function instead of made from the page. Because the key is flagged secret, Netlify's UI/CLI can't read it back (and `netlify dev` won't pull it down) — for local testing put both vars in a local `.env`. Note: env-var changes don't reach already-deployed functions; trigger a redeploy after editing them.

## Run locally

```
npm install -g netlify-cli
netlify dev        # serves page + function at http://localhost:8888
```

Set the two env vars locally first (`netlify env:set …`, or a `.env` file that Netlify CLI reads). Submitting the form will create a real profile in your Klaviyo account, so use a test list.

## Deploy — done (live at [pardnerboots.com](https://pardnerboots.com))

Deployed 2026-07-08 from `github.com/upsmancsr/pardner-boots` to a separate
Pardner Boots Netlify account (site: `pardner-boots.netlify.app`). Netlify
auto-deploys every push to `main` — no build command; **base directory
`boot-waitlist`** (the one setting that matters, since this folder isn't the
repo root; publish and functions dirs then come from `netlify.toml`).

## What lands in Klaviyo per signup

Each profile gets these custom properties (segmentable, and usable in flows):

| Property | Values |
|---|---|
| `kids_shoe_size` | 6C–13C or "Not sure" |
| `price_intent` | $98 / $118 / More than $118 / Not sure |
| `matters_most` | The western look / Foot health & fit / Both equally |
| `headline_variant` | a / b / c (which message they converted on) |
| `source` | founding-waitlist |

Then: trigger a welcome flow on list-join, and at launch segment (e.g. `kids_shoe_size` in 8C–12C **and** `price_intent` = $118) to send the founding-batch announcement to exactly the right people.

## Measuring the A/B test

`headline_variant` on each profile tells you the **conversion mix** — but conversion *rate* needs impressions per variant too. Two clean options:

- **GA4 (built in):** paste your Measurement ID into `GA_MEASUREMENT_ID` at the top of `main.js` (empty = fully disabled). Every event carries `headline_variant`; a successful signup fires a `join_waitlist` event. In GA4, register `headline_variant` as an event-scoped custom dimension (Admin → Custom definitions), then conversion rate per variant = `join_waitlist` ÷ `page_view`.
- Or drive traffic with `?v=a`, `?v=b`, `?v=c` on separate links/campaigns so each variant's impressions and signups are attributable at the source.

Variant assignment is sticky per visitor (stored in `localStorage`) so returning visitors see the same headline.

## Adding a deposit later (the "reserve a pair" upgrade)

Once you have a real render or sample, add a refundable deposit without a rebuild:

1. In Stripe, create a **Payment Link** for the deposit amount.
2. In `index.html`, at the `DEPOSIT SLOT` comment inside the form, add a button linking to that URL (`<a class="btn btn-primary" href="https://buy.stripe.com/…">Reserve your pair — refundable $X</a>`).

That's the fastest path to a revealed-preference signal (real money) versus the stated-preference survey you're running now.
