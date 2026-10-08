import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

export const POST_STATUSES = ["draft", "pending", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export function parsePostStatus(value: string | null | undefined): PostStatus {
  if (value === "pending" || value === "published") return value;
  return "draft";
}

/** Members can draft or submit. Only an admin can leave a post published. */
export function resolvePostStatus(
  requested: PostStatus,
  isAdmin: boolean,
  existing?: PostStatus,
): PostStatus {
  if (isAdmin) return requested;
  if (existing === "published" || requested === "published") return "pending";
  return requested === "pending" ? "pending" : "draft";
}

let statusReady: Promise<void> | null = null;

export function ensurePendingStatus() {
  statusReady ??= widenStatusColumns().catch((error) => {
    statusReady = null;
    throw error;
  });
  return statusReady;
}

async function widenStatusColumns() {
  for (const table of ["news", "events"] as const) {
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SHOW COLUMNS FROM \`${table}\` LIKE 'status'`,
    );
    const type = String(rows[0]?.Type ?? "");
    if (type.toLowerCase().startsWith("enum") && !type.includes("'pending'")) {
      await getPool().query(
        `ALTER TABLE \`${table}\` MODIFY status ENUM('draft','pending','published') NOT NULL DEFAULT 'draft'`,
      );
    }
  }
}
