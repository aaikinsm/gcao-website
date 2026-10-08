import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMemberById, type CmsUser } from "@/lib/members";

export const getCmsUser = cache(async (): Promise<CmsUser | null> => {
  if (!process.env.AUTH_SECRET) return null;
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return getMemberById(id);
});

export async function assertCmsAllowed() {
  const user = await getCmsUser();
  if (!user) redirect("/cms/login");
  if (!user.name) redirect("/cms/name");
  return user;
}
