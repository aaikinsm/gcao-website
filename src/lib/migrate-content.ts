import { ensureNewsKindColumn } from "@/lib/news";
import { ensurePostExtras } from "@/lib/post-extras";
import { ensureAuthorColumns, ensurePendingStatus } from "@/lib/post-status";

export async function migrateContentSchema() {
  await ensurePendingStatus();
  await ensureAuthorColumns();
  await ensurePostExtras();
  await ensureNewsKindColumn();
}
