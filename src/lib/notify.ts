import { listMembers } from "@/lib/members";
import { siteOrigin } from "@/lib/seo";

export async function notifyAdminsOfPending(title: string) {
  const key = process.env.AUTH_RESEND_KEY?.trim();
  const from = process.env.AUTH_EMAIL_FROM?.trim();
  if (!key || !from) return;

  try {
    const members = await listMembers();
    const to = members.flatMap((member) =>
      member.role === "admin" && member.email ? [member.email] : [],
    );
    if (to.length === 0) return;
    const origin = await siteOrigin();
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Approval needed: ${title}`,
        text: `${title} was submitted and needs an admin to publish it.\n\n${origin}/cms/posts?filter=pending`,
      }),
    });
    if (!response.ok) console.error("Could not email admins", response.status);
  } catch (error) {
    console.error("Could not email admins", error);
  }
}
