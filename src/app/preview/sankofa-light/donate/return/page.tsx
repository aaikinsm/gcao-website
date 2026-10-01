import { SankofaDonateReturn } from "@/components/previews/SankofaDonateReturn";

export default async function SankofaLightDonateReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const query = await searchParams;
  return (
    <SankofaDonateReturn
      theme="light"
      optionLabel="A — Sankofa Light · Donate"
      basePath="/preview/sankofa-light"
      sessionId={query.session_id}
    />
  );
}
