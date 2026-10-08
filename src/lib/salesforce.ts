import { headers } from "next/headers";

export type InterestKind = "Volunteer" | "Membership" | "Jobs";

const KINDS: InterestKind[] = ["Volunteer", "Membership", "Jobs"];

export function salesforceConfigured() {
  return Boolean(process.env.SALESFORCE_WEBTOLEAD_URL && process.env.SALESFORCE_OID);
}

export function isInterestKind(value: string): value is InterestKind {
  return KINDS.includes(value as InterestKind);
}

function fieldName(envKey: string, fallback: string) {
  const value = process.env[envKey]?.trim();
  return value || fallback;
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return { first: "", last: parts[0] ?? "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function postWebToLead(input: {
  kind: InterestKind;
  name: string;
  email: string;
  phone: string;
  description: string;
}) {
  const url = process.env.SALESFORCE_WEBTOLEAD_URL;
  const oid = process.env.SALESFORCE_OID;
  if (!url || !oid) throw new Error("Salesforce is not configured.");

  const { first, last } = splitName(input.name);
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const params = new URLSearchParams();
  params.set("oid", oid);
  params.set("retURL", `${proto}://${host}/get-involved`);
  params.set(fieldName("SALESFORCE_FIELD_FIRST_NAME", "first_name"), first);
  params.set(fieldName("SALESFORCE_FIELD_LAST_NAME", "last_name"), last);
  params.set(fieldName("SALESFORCE_FIELD_EMAIL", "email"), input.email);
  params.set(fieldName("SALESFORCE_FIELD_PHONE", "phone"), input.phone);
  params.set(fieldName("SALESFORCE_FIELD_COMPANY", "company"), "Individual");
  params.set(fieldName("SALESFORCE_FIELD_LEAD_SOURCE", "lead_source"), input.kind);
  params.set(fieldName("SALESFORCE_FIELD_DESCRIPTION", "description"), input.description);
  const interestField = process.env.SALESFORCE_FIELD_INTEREST?.trim();
  if (interestField) params.set(interestField, input.kind);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    redirect: "manual",
  });
  if (response.status < 200 || response.status >= 400) {
    throw new Error("Salesforce did not accept the form.");
  }
}
