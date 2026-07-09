/* ============================================================
   A/B headline test + waitlist form submission
   ============================================================ */

// The three headline variants under test. Only the H1 changes between
// variants — everything else on the page stays constant, so the headline
// is the only variable. Keys are stored on each Klaviyo profile as
// `headline_variant` so you can compare which message converts.
const VARIANTS = {
  a: "A real cowboy boot, designed for kids\u2019 growing feet.",   // real-boot-first (the spine)
  b: "Western boots without the narrow toe box or raised heel.",     // problem-first
  c: "Barefoot cowboy boots for kids.",                              // barefoot-first
};

const STORAGE_KEY = "hv";

function pickVariant() {
  const keys = Object.keys(VARIANTS);
  // 1) explicit override via ?v=a|b|c (handy for sharing a specific version)
  const forced = new URLSearchParams(location.search).get("v");
  if (forced && VARIANTS[forced]) return forced;
  // 2) sticky: a returning visitor sees the same variant
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VARIANTS[saved]) return saved;
  } catch (_) { /* storage blocked — fall through to random */ }
  // 3) assign at random and remember
  const chosen = keys[Math.floor(Math.random() * keys.length)];
  try { localStorage.setItem(STORAGE_KEY, chosen); } catch (_) {}
  return chosen;
}

const variant = pickVariant();
const headlineEl = document.getElementById("headline");
if (headlineEl && variant !== "a") {          // "a" is already in the HTML
  headlineEl.textContent = VARIANTS[variant];
  headlineEl.dataset.variant = variant;
}
document.getElementById("headline_variant").value = variant;
// Tip: also send `variant` to your web analytics as a custom prop/event so you
// can divide signups (conversions) by impressions per variant. See README.

/* ---------------- form ---------------- */
const form = document.getElementById("join-form");
const btn = document.getElementById("submit-btn");
const successPanel = document.getElementById("join-success");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // honeypot: if filled, silently "succeed" without sending
  if (form.company.value) { showSuccess(); return; }

  const email = form.email.value.trim();
  if (!email || !form.child_size.value || !form.price_intent.value) {
    form.reportValidity();
    return;
  }

  const matters = form.querySelector('input[name="matters_most"]:checked');
  const payload = {
    email,
    child_size: form.child_size.value,
    price_intent: form.price_intent.value,
    matters_most: matters ? matters.value : "",
    headline_variant: variant,
  };

  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Joining\u2026";

  try {
    const res = await fetch("/.netlify/functions/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("bad status " + res.status);
    showSuccess();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = original;
    showError();
  }
});

function showSuccess() {
  form.hidden = true;
  successPanel.hidden = false;
  successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showError() {
  let note = document.getElementById("form-error");
  if (!note) {
    note = document.createElement("p");
    note.id = "form-error";
    note.style.cssText = "color:#a23b2c;font-size:0.9rem;text-align:center;margin:0.8rem 0 0";
    note.innerHTML = "That didn\u2019t go through. Try again in a moment \u2014 or email <a href=\"mailto:cameron@pardnerboots.com\">cameron@pardnerboots.com</a> and we\u2019ll add you by hand.";
    btn.insertAdjacentElement("afterend", note);
  }
}
