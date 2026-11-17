import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { RowDataPacket } from "mysql2";
import { authOrigin } from "@/lib/auth-url";
import { getPool } from "@/lib/db";
import { INVITE_COOKIE } from "@/lib/invite-cookie";
import { isAdminEmail } from "@/lib/members";
import { withinRateLimit } from "@/lib/rate-limit";

export type InviteCode = "email" | "already" | "rate" | "config" | "send";

export type PendingInvite = {
  id: string;
  email: string;
};

type InviteRow = RowDataPacket & {
  id: string;
  email: string;
  accepted_at: Date | string | null;
  fresh: number;
};

let invitesReady: Promise<void> | null = null;

function ensureInvites() {
  invitesReady ??= createInviteTable().catch((error) => {
    invitesReady = null;
    throw error;
  });
  return invitesReady;
}

async function createInviteTable() {
  await getPool().query(
    `CREATE TABLE IF NOT EXISTS EditorInvite (
      id VARCHAR(36) NOT NULL,
      email VARCHAR(255) NOT NULL,
      token_hash CHAR(64) NOT NULL,
      invited_by VARCHAR(255) NOT NULL,
      expires DATETIME(3) NOT NULL,
      accepted_at DATETIME(3) NULL,
      revoked_at DATETIME(3) NULL,
      PRIMARY KEY (id),
      KEY EditorInvite_email (email),
      KEY EditorInvite_token (token_hash)
    )`,
  );
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function readInviteCookie() {
  const value = (await cookies()).get(INVITE_COOKIE)?.value ?? "";
  if (!/^[A-Za-z0-9_-]{20,200}$/.test(value)) return null;
  return value;
}

async function findByHash(hash: string) {
  const [rows] = await getPool().query<InviteRow[]>(
    `SELECT id, email, accepted_at, (expires > UTC_TIMESTAMP(3)) AS fresh
     FROM EditorInvite
     WHERE token_hash = ? AND revoked_at IS NULL
     LIMIT 1`,
    [hash],
  );
  return rows[0] ?? null;
}

async function hasAcceptedInvite(email: string) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT id FROM EditorInvite
     WHERE email = ? AND revoked_at IS NULL AND accepted_at IS NOT NULL
     LIMIT 1`,
    [email],
  );
  return rows.length > 0;
}

async function markAccepted(id: string) {
  await getPool().execute(
    `UPDATE EditorInvite
     SET accepted_at = UTC_TIMESTAMP(3)
     WHERE id = ? AND accepted_at IS NULL AND revoked_at IS NULL`,
    [id],
  );
}

async function inviteForEmail(email: string, consume: boolean) {
  await ensureInvites();
  const token = await readInviteCookie();
  if (token) {
    const invite = await findByHash(hashToken(token));
    if (invite && normalizeEmail(invite.email) === email) {
      if (invite.accepted_at || Number(invite.fresh)) {
        if (consume && !invite.accepted_at) {
          await markAccepted(String(invite.id));
          (await cookies()).delete(INVITE_COOKIE);
        }
        return true;
      }
    }
  }
  if (isAdminEmail(email)) return true;
  return hasAcceptedInvite(email);
}

export async function mayRequestEditorSignIn(email: string) {
  return inviteForEmail(normalizeEmail(email), false);
}

export async function acceptEditorSignIn(email: string) {
  return inviteForEmail(normalizeEmail(email), true);
}

async function deliverInvite(email: string, invitedBy: string): Promise<InviteCode | null> {
  const origin = authOrigin();
  const key = process.env.AUTH_RESEND_KEY?.trim();
  const from = process.env.AUTH_EMAIL_FROM?.trim();
  if (!origin || !key || !from) return "config";
  if (!email.includes("@") || !email.includes(".") || email.length > 200) return "email";
  if (isAdminEmail(email)) return "already";
  await ensureInvites();
  if (await hasAcceptedInvite(email)) return "already";
  if (!withinRateLimit(`invite:${invitedBy}`, 10, 60 * 60 * 1000)) return "rate";

  const token = randomBytes(32).toString("base64url");
  await getPool().execute(
    `DELETE FROM EditorInvite
     WHERE email = ? AND accepted_at IS NULL AND revoked_at IS NULL`,
    [email],
  );
  await getPool().execute(
    `INSERT INTO EditorInvite (id, email, token_hash, invited_by, expires)
     VALUES (?, ?, ?, ?, DATE_ADD(UTC_TIMESTAMP(3), INTERVAL 7 DAY))`,
    [randomUUID(), email, hashToken(token), invitedBy],
  );

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "You are invited to edit the GCAO site",
      text: `An admin invited you to draft posts on the GCAO site.\n\nOpen this link and sign in with ${email}:\n${origin}/cms/login?invite=${token}\n\nThe link expires in seven days. After you sign in, your editor access stays until an admin removes it.`,
    }),
  });
  if (!response.ok) return "send";
  return null;
}

export async function sendEditorInvite(email: string, invitedBy: string) {
  const code = await deliverInvite(normalizeEmail(email), invitedBy);
  if (code) return { error: code };
  return { ok: true as const };
}

export async function listPendingInvites(): Promise<PendingInvite[]> {
  await ensureInvites();
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT id, email FROM EditorInvite
     WHERE accepted_at IS NULL AND revoked_at IS NULL AND expires > UTC_TIMESTAMP(3)
     ORDER BY email`,
  );
  return rows.map((row) => ({ id: String(row.id), email: String(row.email) }));
}

export async function revokeEditorInvite(id: string) {
  await ensureInvites();
  await getPool().execute(
    `UPDATE EditorInvite SET revoked_at = UTC_TIMESTAMP(3)
     WHERE id = ? AND revoked_at IS NULL`,
    [id],
  );
}

export async function revokeEditorAccess(email: string) {
  await ensureInvites();
  await getPool().execute(
    `UPDATE EditorInvite SET revoked_at = UTC_TIMESTAMP(3)
     WHERE email = ? AND revoked_at IS NULL`,
    [normalizeEmail(email)],
  );
}
