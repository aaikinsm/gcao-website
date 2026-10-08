"use server";

import { isInterestKind, postWebToLead, salesforceConfigured, type InterestKind } from "@/lib/salesforce";

export type InterestState = { ok: true } | { error: string } | null;

const ROLES = [
  "Communications and marketing",
  "Event planning",
  "Volunteer coordination",
  "Writing and editing",
  "Homework Club tutoring",
];
const AVAILABILITY = ["Weekdays", "Weekends", "Evenings", "Flexible"];

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function description(kind: InterestKind, formData: FormData): { error: string } | { description: string } {
  if (kind === "Volunteer") {
    const programs = formData
      .getAll("programs")
      .map((value) => String(value))
      .filter((value) => ROLES.includes(value));
    const availability = text(formData, "availability", 40);
    const note = text(formData, "note", 2000);
    if (programs.length === 0) return { error: "Choose at least one way to help." };
    if (!AVAILABILITY.includes(availability)) return { error: "Choose when you can help." };
    const lines = [`Roles: ${programs.join(", ")}`, `Availability: ${availability}`];
    if (note) lines.push("", note);
    return { description: lines.join("\n") };
  }
  if (kind === "Jobs") {
    const role = text(formData, "role", 120);
    if (role.length < 2) return { error: "Tell us the kind of role you want." };
    return { description: `Role: ${role}` };
  }
  const note = text(formData, "note", 2000);
  return { description: note || "Membership interest from the website." };
}

export async function submitInterest(_prev: InterestState, formData: FormData): Promise<InterestState> {
  if (!salesforceConfigured()) {
    return { error: "Interest forms are not ready yet." };
  }

  const kindRaw = text(formData, "interest", 20);
  if (!isInterestKind(kindRaw)) return { error: "Choose a valid interest." };

  const name = text(formData, "name", 120);
  const email = text(formData, "email", 200);
  const phone = text(formData, "phone", 40);
  if (name.length < 2) return { error: "Enter your name." };
  if (!email.includes("@") || !email.includes(".")) return { error: "Enter a valid email address." };
  if (phone.length < 7) return { error: "Enter a phone number." };

  const details = description(kindRaw, formData);
  if ("error" in details) return { error: details.error };

  try {
    await postWebToLead({
      kind: kindRaw,
      name,
      email,
      phone,
      description: details.description,
    });
  } catch {
    return { error: "We could not send that just now. Try again in a moment." };
  }

  return { ok: true };
}
