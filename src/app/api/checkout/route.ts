import { NextResponse } from "next/server";
import { authOrigin } from "@/lib/auth-url";
import { withinRateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe";

const MIN_CENTS = 500;
const MAX_CENTS = 5_000_000;
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Donations are unavailable right now." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const amountCents = Number(body?.amountCents);
  const interval = body?.interval;
  const basePath = body?.basePath;
  const theme = body?.theme === "dark" ? "dark" : "light";

  if (!Number.isInteger(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) {
    return NextResponse.json({ error: "Enter at least $5." }, { status: 400 });
  }
  if (interval !== "once" && interval !== "month") {
    return NextResponse.json({ error: "Choose once or monthly." }, { status: 400 });
  }
  if (basePath !== "") {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }

  const origin = authOrigin();
  if (!origin) {
    return NextResponse.json({ error: "Donations are unavailable right now." }, { status: 503 });
  }
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!withinRateLimit(`checkout:${address.slice(0, 80)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Try again shortly." }, { status: 429 });
  }
  const returnUrl = `${origin}${basePath}/donate/return?session_id={CHECKOUT_SESSION_ID}`;
  const monthly = interval === "month";

  const session = await stripe.checkout.sessions.create({
    mode: monthly ? "subscription" : "payment",
    ui_mode: "embedded_page",
    ...(monthly ? {} : { submit_type: "donate" as const }),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: amountCents,
          product_data: {
            name: monthly ? "Monthly donation to GCAO" : "Donation to GCAO",
          },
          ...(monthly ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    return_url: returnUrl,
    name_collection: { individual: { enabled: true, optional: false } },
    phone_number_collection: { enabled: true },
    branding_settings: {
      display_name: "GCAO",
      border_style: "rounded",
      background_color: theme === "dark" ? "#06110D" : "#FFFBF2",
      button_color: theme === "dark" ? "#FCD116" : "#006B3F",
    },
  });

  if (!session.client_secret) {
    return NextResponse.json({ error: "Checkout could not be started." }, { status: 500 });
  }

  return NextResponse.json({ clientSecret: session.client_secret });
}
