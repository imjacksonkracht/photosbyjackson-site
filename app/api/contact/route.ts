import { NextResponse } from "next/server";
import { normalize, shootTypes, validate } from "@/lib/inquiry";
import { site } from "@/content/site";

// Delivery uses the Resend HTTP API. Configure on the host (never in client code):
//   RESEND_API_KEY      — API key from resend.com
//   CONTACT_FROM_EMAIL  — a sender on a domain verified in Resend,
//                         e.g. "Photos by Jackson <bookings@photosbyjackson.org>"
//   CONTACT_TO_EMAIL    — optional; defaults to the public site email
// Without RESEND_API_KEY and CONTACT_FROM_EMAIL the route answers 503 and the
// form tells the visitor to email directly.

const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.CONTACT_RATE_LIMIT) || 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 120);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Spam traps: a hidden field people never see, and a minimum time on page.
  // Bots get a normal-looking success so they don't retry.
  const startedAt = Number(body.startedAt);
  if ((typeof body.website === "string" && body.website.trim()) || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const inquiry = normalize(body);
  const errors = validate(inquiry);
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "invalid", errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL is not set; inquiry not delivered.");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const type = shootTypes.find((t) => t.value === inquiry.type)?.label ?? inquiry.type;
  const text = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Shoot: ${type}`,
    `Date: ${inquiry.date || "Not given"}`,
    `Location: ${inquiry.location || "Not given"}`,
    "",
    inquiry.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: oneLine(`Booking inquiry: ${type} — ${inquiry.name}`),
        text,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend responded", res.status, await res.text());
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
