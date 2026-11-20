"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { submitInterest, type InterestState } from "@/app/get-involved/actions";
import type { InterestKind } from "@/lib/salesforce";

const ROLES = [
  "Communications and marketing",
  "Event planning",
  "Volunteer coordination",
  "Writing and editing",
  "Homework Club tutoring",
];
const AVAILABILITY = ["Weekdays", "Weekends", "Evenings", "Flexible"];

export function GetInvolvedForm({ kind, isLight }: { kind: InterestKind; isLight: boolean }) {
  const [state, action, pending] = useActionState<InterestState, FormData>(submitInterest, null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [note, setNote] = useState("");
  const label = isLight ? "text-[#0F1B14]/55" : "text-[#EFEDE4]/55";
  const field =
    "mt-2 w-full border-b bg-transparent px-0 py-3 text-base outline-none transition-colors " +
    (isLight
      ? "border-black/15 placeholder:text-[#0F1B14]/30 focus:border-[#006B3F]"
      : "border-white/20 placeholder:text-[#EFEDE4]/30 focus:border-[#FCD116]");
  const menu = isLight
    ? "border-black/15 bg-[#FFFBF2] text-[#0F1B14] focus:border-[#006B3F]"
    : "border-white/20 bg-[#06110D] text-[#EFEDE4] focus:border-[#FCD116]";
  const button = isLight ? "bg-[#006B3F] text-white" : "bg-[#FCD116] text-[#06110D]";

  if (state && "ok" in state) {
    return (
      <p className={`text-base leading-relaxed ${isLight ? "text-[#006B3F]" : "text-[#FCD116]"}`}>
        Thank you. We received your {kind === "Volunteer" ? "volunteer" : kind.toLowerCase()} interest and
        will be in touch.
      </p>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => {
      action(data);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-0">
      <input type="hidden" name="interest" value={kind} />
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm">
          <span className={label}>Name</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm">
          <span className={label}>Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className={label}>Phone</span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={field}
          />
        </label>
      </div>

      {kind === "Volunteer" && (
        <>
          <fieldset className="mt-8" aria-required="true">
            <legend className={`text-sm ${label}`}>
              How would you like to help? <span className="font-semibold">Required</span>
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <label
                  key={role}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm has-[:checked]:font-semibold ${
                    isLight
                      ? "border-black/15 has-[:checked]:border-[#006B3F] has-[:checked]:bg-[#006B3F]/10"
                      : "border-white/20 has-[:checked]:border-[#FCD116] has-[:checked]:bg-[#FCD116]/10"
                  }`}
                >
                  <input
                    name="programs"
                    type="checkbox"
                    value={role}
                    checked={roles.includes(role)}
                    onChange={(event) =>
                      setRoles((current) =>
                        event.target.checked
                          ? [...current, role]
                          : current.filter((item) => item !== role),
                      )
                    }
                    className="sr-only"
                  />
                  {role}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-8 block text-sm">
            <span className={label}>When can you help?</span>
            <select
              name="availability"
              required
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              className={`mt-2 w-full border-b px-0 py-3 text-base outline-none transition-colors ${menu}`}
            >
              <option value="" disabled className={menu}>
                Choose one
              </option>
              {AVAILABILITY.map((item) => (
                <option key={item} value={item} className={menu}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-8 block text-sm">
            <span className={label}>Anything else we should know?</span>
            <textarea
              name="note"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className={`${field} resize-y`}
            />
          </label>
        </>
      )}

      {kind === "Membership" && (
        <label className="mt-8 block text-sm">
          <span className={label}>Note, if you have one</span>
          <textarea
            name="note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className={`${field} resize-y`}
          />
        </label>
      )}

      {state && "error" in state && <p className="mt-6 text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className={`btn-premium mt-8 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60 ${button}`}
      >
        {pending ? "Sending…" : kind === "Volunteer" ? "Offer my time" : "Register interest"}
      </button>
    </form>
  );
}
