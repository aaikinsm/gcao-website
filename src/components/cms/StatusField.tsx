import type { PostStatus } from "@/lib/post-status";

const label = "text-sm font-medium text-[#0F1B14]";

const labels: Record<PostStatus, string> = {
  draft: "Draft",
  pending: "Pending approval",
  published: "Published",
};

export function StatusField({
  canPublish,
  status,
}: {
  canPublish: boolean;
  status?: PostStatus;
}) {
  const options: PostStatus[] = canPublish
    ? ["draft", "pending", "published"]
    : ["draft", "pending"];
  const current = !canPublish && status === "published" ? "pending" : (status ?? "draft");

  return (
    <fieldset>
      <legend className={label}>Status</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((value) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-[#FFFBF2] px-4 py-2 text-sm"
          >
            <input type="radio" name="status" value={value} defaultChecked={current === value} />
            {labels[value]}
          </label>
        ))}
      </div>
      {!canPublish && status === "published" && (
        <p className="mt-3 text-sm leading-relaxed text-[#0F1B14]/60">
          This post is live. Saving it sends the update back for approval.
        </p>
      )}
    </fieldset>
  );
}
