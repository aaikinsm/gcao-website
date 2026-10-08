import { redirect } from "next/navigation";
import { setMemberRoleAction } from "@/app/cms/actions";
import { CmsShell } from "@/components/cms/CmsShell";
import { assertCmsAllowed } from "@/lib/cms";
import { listMembers } from "@/lib/members";

export const dynamic = "force-dynamic";

export default async function CmsMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await assertCmsAllowed();
  if (user.role !== "admin") redirect("/cms");

  const query = await searchParams;
  const members = await listMembers();
  const adminCount = members.filter((member) => member.role === "admin").length;

  return (
    <CmsShell
      current="members"
      title="Members"
      description="Anyone who signs in can draft posts. Admins are the ones who publish them."
    >
      {query.saved === "1" && (
        <p className="mb-8 rounded-2xl border border-[#006B3F]/20 bg-[#006B3F]/10 px-5 py-3 text-sm font-medium text-[#006B3F]">
          Role updated. They will see it the next time a page loads.
        </p>
      )}
      {query.error === "last-admin" && (
        <p className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          The last admin cannot be changed to a regular member.
        </p>
      )}
      {members.length === 0 ? (
        <p className="text-[#0F1B14]/50">No one has signed in yet.</p>
      ) : (
        <ul className="divide-y divide-black/5 overflow-hidden rounded-3xl border border-black/10 bg-white">
          {members.map((member) => {
            const lastAdmin = member.role === "admin" && adminCount <= 1;
            return (
              <li key={member.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.name || "Member"}</p>
                  <p className="truncate text-sm text-[#0F1B14]/50">{member.email}</p>
                </div>
                <form action={setMemberRoleAction} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={member.id} />
                  <select
                    name="role"
                    defaultValue={member.role}
                    disabled={lastAdmin}
                    className="rounded-full border border-black/10 bg-[#FFFBF2] px-4 py-2 text-sm disabled:opacity-60"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="submit"
                    disabled={lastAdmin}
                    className="rounded-full bg-[#006B3F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Save
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </CmsShell>
  );
}
