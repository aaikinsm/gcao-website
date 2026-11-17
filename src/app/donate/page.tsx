import { SankofaDonate } from "@/components/previews/SankofaDonate";
import { stripeConfigured } from "@/lib/stripe";

export default function DonatePage() {
  return <SankofaDonate configured={stripeConfigured()} />;
}
