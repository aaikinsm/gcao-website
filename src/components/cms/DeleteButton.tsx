"use client";

import { deleteEventAction, deleteNewsAction } from "@/app/cms/actions";

export function DeleteButton({
  id,
  kind,
  title,
}: {
  id: number;
  kind: "event" | "news";
  title: string;
}) {
  const action = kind === "event" ? deleteEventAction.bind(null, id) : deleteNewsAction.bind(null, id);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Delete “${title}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
