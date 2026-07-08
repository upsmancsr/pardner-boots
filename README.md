# Pardner Boots

An Austin-designed kids' anatomical western boot — a real cowboy boot, corrected
for the shape of a child's foot. This repo holds the planning docs and the
founding-waitlist landing page.

> **A real cowboy boot — built like the grown-up ones, shaped like a kid's foot.**

## What's here

| Path | What it is |
|---|---|
| [`DECISIONS.md`](DECISIONS.md) | Locked decisions + open threads. **Start here.** |
| [`docs/`](docs/) | Founder Product Brief, Technical Fit Brief, Execution Packet, and the Footwear Developer RFP (`.docx`). |
| [`boot-waitlist/`](boot-waitlist/) | Static waitlist landing page (Netlify) that writes signups into Klaviyo. |

## The docs

- **[Founder Product Brief](docs/Founder-Product-Brief-v0.3.md)** — thesis,
  positioning, MVP definition, price and material direction.
- **[Technical Fit Brief](docs/Technical-Fit-Brief-v0.3.md)** — fit priority
  hierarchy, the notched zero-drop outsole, closure, and the fit-test plan.
- **[Execution Packet](docs/Execution-Packet-v0.3.md)** — developer RFP and the
  gated, costed roadmap (validation → preorder → production).

## The waitlist page

See [`boot-waitlist/README.md`](boot-waitlist/README.md) for setup, Klaviyo
config, and deploy steps. To preview locally:

```
cd boot-waitlist
netlify dev        # serves the page + function at http://localhost:8888
```
