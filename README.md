# Pardner Boots

The founding-waitlist site for Pardner Boots — an Austin-designed kids'
western boot with a natural toe shape, a level footbed, and a secure fit.

**Live at [pardnerboots.com](https://pardnerboots.com).**

## What's here

| Path | What it is |
|---|---|
| [`boot-waitlist/`](boot-waitlist/) | The landing page: static site + one Netlify function that writes signups into Klaviyo. |

Netlify auto-deploys every push to `main` (base directory `boot-waitlist`).
See [`boot-waitlist/README.md`](boot-waitlist/README.md) for setup notes,
Klaviyo config, and A/B-test measurement.

To preview locally:

```
cd boot-waitlist
netlify dev        # serves the page + function at http://localhost:8888
```

Product and business planning docs live in a separate private repo.
