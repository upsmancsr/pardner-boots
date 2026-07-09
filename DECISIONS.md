# Decisions Log — Kids Anatomical Western Boot

The single source of truth for what's **locked** and what's still **open**. Update
this as calls are made so future sessions start oriented. When a locked decision
changes, don't delete it — move it down to a "Superseded" note with the date and
reason.

_Last updated: 2026-07-08_

---

## Locked Decisions

1. **Last** — A **new anatomical last**, never a modified western last. We may
   adapt an existing *anatomical* last toward western styling, but never start
   from a western last and widen it (toe shape, toe spring, and drop *are* the
   last). The FreeCAD concept model is a communication tool only — not a
   production last or licensing basis; the company owns the new last outright.

2. **Closure** — **Inner (medial) side zip, exposed (no flap).** The zip is the
   functional closure and the primary heel-security tool. Pull tabs are retained
   as western styling + a light entry assist, **not** the closure. Comfort
   detail: a thin underlay/facing sits behind the zipper teeth so the tape and
   pull don't rest against the child's foot/sock (a lining detail, not a flap).

3. **Size range** — Founding batch **8C–12C** (full **6C–13C** later).
   **Sample size 10C.** Validate 8C and 12C before grading the founding run.

4. **Drop & stack** — **Zero internal drop** via a notched-underside outsole:
   a flat-topped slab gives a level footbed; the visual western heel and
   heel-breast are cut into the *underside* of the sole, never stacked under the
   foot. **≈15 mm total stack is a CEILING — pursue slimmer.** Perceived heel
   comes from notch depth and a crisp heel-breast, not from thickness.

5. **Pricing** — **$118 retail / ~$98 founding price**, with headroom to price
   **above $118** if the product warrants it. **No fixed landed-cost target is
   given to vendors** — ask them to cost the product honestly at spec.

6. **Waitlist stack** — **Klaviyo only** for the waitlist. Landing page hosted on
   **Netlify** (static page + one serverless function that talks to Klaviyo).

7. **Infrastructure separation** — *All* Pardner Boots accounts are fully
   separate from Mandala Scrubs: its own email workspace (@pardnerboots.com,
   not an alias in the Mandala Google Workspace), its own Netlify account,
   its own Klaviyo account. Different projects, separated concerns.

---

## Open Threads (track — don't act yet)

- **Landed-cost lever decision.** Which lever to pull when quotes come back above
  target (raise retail → simplify non-visible cost → accept thin founding-batch
  margin). Framework exists in the Execution Packet; the *decision* waits on real
  quotes from the diagnostic sprint. Dedicated session once quotes land.

- **Welcome email flow for the waitlist.** Not built yet. A list-join welcome
  flow in Klaviyo (confirm → what to expect → founding-price promise). Design and
  build when we turn to lifecycle email.

- **Klaviyo account — create at deploy time.** Stand up a *separate* Pardner Boots
  Klaviyo account (not a list in Mandala Scrubs) before the page goes public —
  need List ID, a Private API key (Profiles + Lists + Subscriptions write), and a
  verified sender for double opt-in. Any signup before this exists is lost, not
  queued.

---

## Reference

- Product briefs and the developer RFP: [`docs/`](docs/)
- Waitlist landing page: [`boot-waitlist/`](boot-waitlist/)
