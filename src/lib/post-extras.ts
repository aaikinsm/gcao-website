import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

export type { BodyMode } from "@/lib/post-fields";
export { parseBodyMode, parseYoutubeInput, youtubeWatchUrl } from "@/lib/post-fields";

let extrasReady: Promise<void> | null = null;

export function ensurePostExtras() {
  extrasReady ??= addPostExtras().catch((error) => {
    extrasReady = null;
    throw error;
  });
  return extrasReady;
}

async function columnMissing(table: "news" | "events", column: string) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SHOW COLUMNS FROM \`${table}\` LIKE ?`,
    [column],
  );
  return rows.length === 0;
}

async function addPostExtras() {
  for (const table of ["news", "events"] as const) {
    if (await columnMissing(table, "body_mode")) {
      await getPool().query(
        `ALTER TABLE \`${table}\` ADD COLUMN body_mode VARCHAR(20) NOT NULL DEFAULT 'formatted'`,
      );
    }
    if (await columnMissing(table, "youtube_id")) {
      await getPool().query(`ALTER TABLE \`${table}\` ADD COLUMN youtube_id VARCHAR(20) NULL`);
    }
    if (await columnMissing(table, "featured")) {
      await getPool().query(
        `ALTER TABLE \`${table}\` ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0`,
      );
    }
  }

  await getPool().query(
    `CREATE TABLE IF NOT EXISTS post_attachments (
      id INT NOT NULL AUTO_INCREMENT,
      post_type VARCHAR(10) NOT NULL,
      post_id INT NOT NULL,
      url VARCHAR(500) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      caption VARCHAR(255) NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      KEY post_attachments_post (post_type, post_id)
    )`,
  );
}
