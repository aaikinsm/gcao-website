"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { getCmsUser } from "@/lib/cms";
import { setUserName } from "@/lib/members";

export async function signOutAction() {
  await signOut({ redirectTo: "/cms/login" });
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/cms" });
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) redirect("/cms/login?error=email");
  try {
    await signIn("resend", { email, redirectTo: "/cms" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/cms/login?error=email");
    throw error;
  }
}

export async function saveMemberName(formData: FormData) {
  const user = await getCmsUser();
  if (!user) redirect("/cms/login");
  if (user.name) redirect("/cms");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 120) redirect("/cms/name?error=name");

  await setUserName(user.id, name);
  redirect("/cms");
}
