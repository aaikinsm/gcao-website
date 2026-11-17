import { SankofaDonateReturn } from "@/components/previews/SankofaDonateReturn";
import { getCheckoutSession } from "@/lib/stripe";

function formatAmount(cents: number | null, currency: string | null) {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: (currency ?? "cad").toUpperCase(),
  }).format(cents / 100);
}

export default async function DonateReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const query = await searchParams;
  const session = query.session_id ? await getCheckoutSession(query.session_id) : null;
  const paid = session?.status === "complete" || session?.payment_status === "paid";
  const amount = formatAmount(session?.amount_total ?? null, session?.currency ?? null);
  const monthly = session?.mode === "subscription";

  return <SankofaDonateReturn paid={paid} amount={amount} monthly={monthly} />;
}
