import { SankofaDonateReturn } from "@/components/previews/SankofaDonateReturn";

export default async function SankofaDarkDonateReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const query = await searchParams;
  return (
    <SankofaDonateReturn
      theme="dark"
      optionLabel="B — Sankofa Dark · Donate"
      basePath="/preview/sankofa"
      sessionId={query.session_id}
    />
  );
}
