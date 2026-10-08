import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";

export type MemberRole = "admin" | "member";

export type CmsUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: MemberRole;
};

export type MemberAccount = {
  id: string;
  name: string | null;
  email: string | null;
  role: MemberRole;
};

export function isAdminEmail(email: string) {
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.trim().toLowerCase());
}

export function parseMemberRole(value: string | null | undefined): MemberRole {
  return value === "admin" ? "admin" : "member";
}

let tablesReady: Promise<void> | null = null;

export function ensureAuthTables() {
  tablesReady ??= createAuthTables().catch((error) => {
    tablesReady = null;
    throw error;
  });
  return tablesReady;
}

async function tableExists(name: string) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT TABLE_NAME AS name
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = LOWER(?)
     LIMIT 1`,
    [name],
  );
  return rows.length > 0;
}

async function createAuthTables() {
  await getPool().query(
    `CREATE TABLE IF NOT EXISTS \`User\` (
      id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NULL,
      email VARCHAR(255) NULL,
      emailVerified DATETIME(3) NULL,
      image TEXT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'member',
      PRIMARY KEY (id),
      UNIQUE KEY User_email (email)
    )`,
  );
  await getPool().query(
    `CREATE TABLE IF NOT EXISTS \`Account\` (
      userId VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      providerAccountId VARCHAR(255) NOT NULL,
      refresh_token TEXT NULL,
      access_token TEXT NULL,
      expires_at BIGINT NULL,
      token_type VARCHAR(255) NULL,
      scope VARCHAR(255) NULL,
      id_token TEXT NULL,
      session_state VARCHAR(255) NULL,
      PRIMARY KEY (provider, providerAccountId),
      KEY Account_userId (userId)
    )`,
  );
  await getPool().query(
    `CREATE TABLE IF NOT EXISTS \`Session\` (
      sessionToken VARCHAR(255) NOT NULL,
      userId VARCHAR(255) NOT NULL,
      expires DATETIME(3) NOT NULL,
      PRIMARY KEY (sessionToken),
      KEY Session_userId (userId)
    )`,
  );
  await getPool().query(
    `CREATE TABLE IF NOT EXISTS \`VerificationToken\` (
      identifier VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires DATETIME(3) NOT NULL,
      PRIMARY KEY (identifier, token)
    )`,
  );

  if (await tableExists("User")) {
    const [columns] = await getPool().query<RowDataPacket[]>(
      "SHOW COLUMNS FROM `User` LIKE 'role'",
    );
    if (columns.length === 0) {
      await getPool().query(
        "ALTER TABLE `User` ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'member'",
      );
    }
  }
}

export async function getUserRole(id: string): Promise<MemberRole | null> {
  const member = await getMemberById(id);
  return member?.role ?? null;
}

export async function getMemberById(id: string): Promise<CmsUser | null> {
  await ensureAuthTables();
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT id, name, email, role FROM `User` WHERE id = ? LIMIT 1",
    [id],
  );
  const row = rows[0];
  if (!row) return null;
  const name = typeof row.name === "string" ? row.name.trim() : "";
  return {
    id: String(row.id),
    name: name || null,
    email: row.email ? String(row.email) : null,
    role: parseMemberRole(String(row.role ?? "")),
  };
}

export async function setUserName(id: string, name: string) {
  await ensureAuthTables();
  await getPool().execute<ResultSetHeader>("UPDATE `User` SET name = ? WHERE id = ?", [name, id]);
}

export async function setUserRole(id: string, role: MemberRole) {
  await ensureAuthTables();
  await getPool().execute<ResultSetHeader>("UPDATE `User` SET role = ? WHERE id = ?", [role, id]);
}

export async function countAdmins() {
  await ensureAuthTables();
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM `User` WHERE role = 'admin'",
  );
  return Number(rows[0]?.total ?? 0);
}

export async function listMembers(): Promise<MemberAccount[]> {
  await ensureAuthTables();
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT id, name, email, role FROM `User` ORDER BY email",
  );
  return rows.map((row) => ({
    id: String(row.id),
    name: row.name ? String(row.name) : null,
    email: row.email ? String(row.email) : null,
    role: parseMemberRole(String(row.role ?? "")),
  }));
}
