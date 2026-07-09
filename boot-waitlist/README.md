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

## What to swap before launch

- ~~**Brand name**~~ — done: set to **Pardner Boots** (nav, footer, `<title>`, and the `styles.css` header). Use bare "Pardner" only where in-sentence context calls for it.
- **Hero render** — in `index.html`, replace the `.render-slot` block with `<img src="…" alt="…">` once you have a concept render or sample photo.
- ~~**Contact email**~~ — done: the error message in `main.js` (`showError`) links to **cameron@pardnerboots.com**.
- **Domain** — set in Netlify after deploy.

## Klaviyo setup (one-time)

1. Create a **separate Klaviyo account** for this brand (not a list inside another account — different domain, sending reputation, and future store).
2. Create a **List** for the founding waitlist. Copy its **List ID** (Lists & Segments → the list → the 6-char ID in the URL, e.g. `Y6nRLr`).
3. Create a **Private API key** (Settings → API keys) with write access to **Profiles, Lists, and Subscriptions**.
4. **Opt-in mode:** the list defaults to *double opt-in* (Klaviyo sends a confirmation email; the profile isn't fully on the list until they click). That's the safest for consent, and the page's success copy already assumes it. If you'd rather capture single opt-in (lower friction, no confirm step), switch the list to single opt-in and change the success message in `index.html`.

## Environment variables (set in Netlify → Site → Environment variables)

```
KLAVIYO_PRIVATE_API_KEY = pk_xxxxxxxxxxxxxxxxxxxxxxxx
KLAVIYO_LIST_ID         = Y6nRLr
```

The private key lives only in the function's environment — it is never exposed to the browser. That's the whole reason the call is routed through the function instead of made from the page.

## Run locally

```
npm install -g netlify-cli
netlify dev        # serves page + function at http://localhost:8888
```

Set the two env vars locally first (`netlify env:set …`, or a `.env` file that Netlify CLI reads). Submitting the form will create a real profile in your Klaviyo account, so use a test list.

## Deploy

1. Push this folder to a Git repo.
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Build settings: no build command; publish directory `.`; functions directory `netlify/functions` (already in `netlify.toml`).
4. Add the two environment variables.
5. Deploy, then point your domain at the site.

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

- Send `variant` to your web analytics (Plausible, GA4, etc.) as a custom event/property on page load, then compare signups-by-variant (from Klaviyo) against pageviews-by-variant (from analytics).
- Or drive traffic with `?v=a`, `?v=b`, `?v=c` on separate links/campaigns so each variant's impressions and signups are attributable at the source.

Variant assignment is sticky per visitor (stored in `localStorage`) so returning visitors see the same headline.

## Adding a deposit later (the "reserve a pair" upgrade)

Once you have a real render or sample, add a refundable deposit without a rebuild:

1. In Stripe, create a **Payment Link** for the deposit amount.
2. In `index.html`, at the `DEPOSIT SLOT` comment inside the form, add a button linking to that URL (`<a class="btn btn-primary" href="https://buy.stripe.com/…">Reserve your pair — refundable $X</a>`).

That's the fastest path to a revealed-preference signal (real money) versus the stated-preference survey you're running now.
