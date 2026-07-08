/* ============================================================
   POST /.netlify/functions/subscribe
   Two Klaviyo calls (email keys both):
     1) profile-import  -> upsert profile + custom properties
     2) profile-subscription-bulk-create-jobs -> consent + add to list
   The subscribe call is the consent-critical one; if it fails we
   return an error. The property upsert is best-effort.

   Env vars (set in Netlify > Site settings > Environment variables):
     KLAVIYO_PRIVATE_API_KEY   (pk_...  — needs Profiles + Lists + Subscriptions write)
     KLAVIYO_LIST_ID           (the founding-waitlist list ID, e.g. "Y6nRLr")
   ============================================================ */

const KLAVIYO_BASE = "https://a.klaviyo.com/api";
const REVISION = "2025-01-15"; // bump to a newer Klaviyo API revision if you like

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
  const LIST_ID = process.env.KLAVIYO_LIST_ID;
  if (!KEY) return json(500, { error: "Server not configured" });

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return json(400, { error: "Bad JSON" }); }

  const email = (body.email || "").trim();
  if (!email || !email.includes("@")) return json(400, { error: "Valid email required" });

  const headers = {
    "Authorization": `Klaviyo-API-Key ${KEY}`,
    "revision": REVISION,
    "accept": "application/json",
    "content-type": "application/json",
  };

  const properties = {
    kids_shoe_size: body.child_size || "",
    price_intent: body.price_intent || "",
    matters_most: body.matters_most || "",
    headline_variant: body.headline_variant || "",
    source: "founding-waitlist",
  };

  // 1) upsert profile + properties (best-effort)
  try {
    await fetch(`${KLAVIYO_BASE}/profile-import`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: { type: "profile", attributes: { email, properties } },
      }),
    });
  } catch (e) {
    console.log("profile-import failed (non-fatal):", e.message);
  }

  // 2) subscribe (consent + list) — the critical call
  const subAttributes = {
    profiles: {
      data: [{
        type: "profile",
        attributes: {
          email,
          subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
        },
      }],
    },
  };
  const subBody = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: subAttributes,
    },
  };
  if (LIST_ID) {
    subBody.data.relationships = { list: { data: { type: "list", id: LIST_ID } } };
  }

  try {
    const res = await fetch(`${KLAVIYO_BASE}/profile-subscription-bulk-create-jobs/`, {
      method: "POST",
      headers,
      body: JSON.stringify(subBody),
    });
    // Klaviyo returns 202 Accepted for this async job
    if (res.status >= 200 && res.status < 300) return json(200, { ok: true });
    const detail = await res.text();
    console.log("subscribe failed:", res.status, detail);
    return json(502, { error: "Subscribe failed" });
  } catch (e) {
    console.log("subscribe error:", e.message);
    return json(502, { error: "Subscribe error" });
  }
};

function json(statusCode, obj) {
  return { statusCode, headers: { "content-type": "application/json" }, body: JSON.stringify(obj) };
}
