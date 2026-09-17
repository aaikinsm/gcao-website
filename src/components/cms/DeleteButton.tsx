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
    <button
      type="button"
      onClick={() => {
        if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
        void action();
      }}
      className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
