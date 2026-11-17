import type { MemberRole } from "@/lib/members";
import type { PostStatus } from "@/lib/post-status";

export function canChangePost(
  user: { id: string; role: MemberRole },
  post: { authorId: string | null; status: PostStatus },
) {
  if (user.role === "admin") return true;
  if (post.status === "published") return false;
  return post.authorId === user.id;
}

export function postAccessError(
  user: { id: string; role: MemberRole },
  post: { authorId: string | null; status: PostStatus },
) {
  if (canChangePost(user, post)) return null;
  if (post.status === "published") return "published";
  return "forbidden";
}
