import type { DefaultSession } from "next-auth";
import type { MemberRole } from "@/lib/members";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: MemberRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: MemberRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: MemberRole;
  }
}
