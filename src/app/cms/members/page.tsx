import { redirect } from "next/navigation";
import {
  revokeEditorAccessAction,
  revokeEditorInviteAction,
  sendEditorInviteAction,
  setMemberRoleAction,
} from "@/app/cms/actions";
import { CmsShell } from "@/components/cms/CmsShell";
import { assertCmsAllowed } from "@/lib/cms";
import { listPendingInvites } from "@/lib/invites";
import { isAdminEmail, listMembers } from "@/lib/members";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-full border border-black/10 bg-[#FFFBF2] px-4 py-2 text-sm outline-none ring-[#006B3F]/30 focus:ring-2 sm:w-72";

export default async function CmsMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; invited?: string; revoked?: string; error?: string }>;
}) {
  const user = await assertCmsAllowed();
  if (user.role !== "admin") redirect("/cms");

  const query = await searchParams;
  const [members, pending] = await Promise.all([listMembers(), listPendingInvites()]);
  const adminCount = members.filter((member) => member.role === "admin").length;

  return (
    <CmsShell
      current="members"
      title="Editors"
      description="An admin invites an editor. An admin publishes their posts."
    >
      {query.saved === "1" && <Notice tone="ok">Role updated. They will see it the next time a page loads.</Notice>}
      {query.invited === "1" && <Notice tone="ok">Invite sent.</Notice>}
      {query.revoked === "1" && <Notice tone="ok">Access removed.</Notice>}
      {query.error === "last-admin" && <Notice>The last admin cannot be changed to an editor.</Notice>}
      {query.error === "email" && <Notice>Enter a valid email address.</Notice>}
      {query.error === "already" && <Notice>That person can already sign in.</Notice>}
      {query.error === "rate" && <Notice>Wait a while before sending more invites.</Notice>}
      {query.error === "config" && <Notice>Invites need the public site address and email setup.</Notice>}
      {query.error === "send" && <Notice>The invite email could not be sent.</Notice>}

      <form action={sendEditorInviteAction} className="mb-10 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium" htmlFor="invite-email">
          Invite an editor
        </label>
        <input
          id="invite-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          className={field}
        />
        <button type="submit" className="rounded-full bg-[#006B3F] px-4 py-2 text-sm font-semibold text-white">
          Send invite
        </button>
      </form>

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0F1B14]/50">Waiting to accept</h2>
          <ul className="mt-3 divide-y divide-black/5 overflow-hidden rounded-3xl border border-black/10 bg-white">
            {pending.map((invite) => (
              <li key={invite.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <p className="truncate text-sm">{invite.email}</p>
                <div className="flex items-center gap-2">
                  <form action={sendEditorInviteAction}>
                    <input type="hidden" name="email" value={invite.email} />
                    <button type="submit" className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
                      Resend
                    </button>
                  </form>
                  <form action={revokeEditorInviteAction}>
                    <input type="hidden" name="id" value={invite.id} />
                    <button type="submit" className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
                      Revoke
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {members.length === 0 ? (
        <p className="text-[#0F1B14]/50">No one has signed in yet.</p>
      ) : (
        <ul className="divide-y divide-black/5 overflow-hidden rounded-3xl border border-black/10 bg-white">
          {members.map((member) => {
            const lastAdmin = member.role === "admin" && adminCount <= 1;
            const lockedAdmin = member.email ? isAdminEmail(member.email) : false;
            const canRemove = Boolean(member.email) && member.id !== user.id && !lockedAdmin;
            return (
              <li key={member.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.name || "Editor"}</p>
                  <p className="truncate text-sm text-[#0F1B14]/50">{member.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={setMemberRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={member.id} />
                    <select
                      name="role"
                      defaultValue={member.role}
                      disabled={lastAdmin}
                      className="rounded-full border border-black/10 bg-[#FFFBF2] px-4 py-2 text-sm disabled:opacity-60"
                    >
                      <option value="member">Editor</option>
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
                  {canRemove && (
                    <form action={revokeEditorAccessAction}>
                      <input type="hidden" name="email" value={member.email ?? ""} />
                      <button type="submit" className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
                        Remove access
                      </button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </CmsShell>
  );
}

function Notice({ children, tone = "bad" }: { children: string; tone?: "ok" | "bad" }) {
  const className =
    tone === "ok"
      ? "mb-8 rounded-2xl border border-[#006B3F]/20 bg-[#006B3F]/10 px-5 py-3 text-sm font-medium text-[#006B3F]"
      : "mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700";
  return <p className={className}>{children}</p>;
}
