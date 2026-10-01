"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function dollarsToCents(value: string) {
  const trimmed = value.trim().replace(/^\$/, "");
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  return Math.round(Number(trimmed) * 100);
}

interface DonateCheckoutProps {
  basePath: string;
  isLight: boolean;
  configured: boolean;
}

export function DonateCheckout({ basePath, isLight, configured }: DonateCheckoutProps) {
  const [interval, setInterval] = useState<"once" | "month">("once");
  const [amount, setAmount] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  const trimmed = amount.trim();
  const amountCents = trimmed === "" ? null : dollarsToCents(trimmed);
  const ready = configured && amountCents !== null && amountCents >= 500;
  const belowMinimum = configured && trimmed !== "" && !ready;
  const checkoutKey = ready ? `${interval}-${amountCents}` : "";

  const muted = isLight ? "text-[#0F1B14]/55" : "text-[#EFEDE4]/55";
  const chip = isLight
    ? "border-black/10 hover:border-[#006B3F]"
    : "border-white/15 hover:border-[#FCD116]";
  const chipOn = isLight
    ? "border-[#006B3F] bg-[#006B3F] text-white"
    : "border-[#FCD116] bg-[#FCD116] text-[#06110D]";

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountCents,
        interval,
        basePath,
        theme: isLight ? "light" : "dark",
      }),
    });
    const data = (await response.json()) as { clientSecret?: string; error?: string };
    if (!response.ok || !data.clientSecret) {
      throw new Error(data.error ?? "Checkout could not be started.");
    }
    return data.clientSecret;
  }, [amountCents, interval, basePath, isLight]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {(
          [
            ["once", "Give once"],
            ["month", "Monthly"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setInterval(value)}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              interval === value ? chipOn : chip
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="mt-10 block">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${muted}`}>
          Amount
        </span>
        <input
          ref={amountRef}
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Enter amount"
          aria-label="Donation amount in Canadian dollars"
          className={`mt-3 w-full bg-transparent text-4xl font-semibold tracking-tight outline-none placeholder:opacity-35 md:text-5xl ${
            isLight ? "placeholder:text-[#0F1B14]" : "placeholder:text-[#EFEDE4]"
          }`}
          style={{ fontFamily: "var(--font-sankofa), sans-serif" }}
        />
      </label>

      {!configured && (
        <p className={`mt-8 text-sm leading-relaxed ${muted}`}>
          Stripe is not configured yet. Add the test keys to the site environment, then reload this page.
        </p>
      )}

      {belowMinimum && (
        <p className={`mt-8 text-sm leading-relaxed ${muted}`}>Enter at least $5.</p>
      )}

      {ready && stripePromise && (
        <div key={checkoutKey} className="mt-8">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  );
}
