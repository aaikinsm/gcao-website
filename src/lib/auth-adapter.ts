import { KyselyAdapter, type Database } from "@auth/kysely-adapter";
import type { Adapter, AdapterAccount, AdapterUser } from "@auth/core/adapters";
import { Kysely, MysqlDialect } from "kysely";
import { getPool } from "@/lib/db";
import { ensureAuthTables } from "@/lib/members";

let db: Kysely<Database> | null = null;

function authDb() {
  if (!db) {
    db = new Kysely<Database>({
      dialect: new MysqlDialect({ pool: getPool().pool }),
    });
  }
  return db;
}

function cleanUser(data: AdapterUser): AdapterUser {
  return {
    id: data.id,
    name: data.name ?? null,
    email: data.email,
    emailVerified: data.emailVerified ?? null,
    image: data.image ?? null,
  };
}

function cleanAccount(account: AdapterAccount): AdapterAccount {
  const row: Record<string, unknown> = {
    userId: account.userId,
    type: account.type,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
  };
  if (typeof account.refresh_token === "string") row.refresh_token = account.refresh_token;
  if (typeof account.access_token === "string") row.access_token = account.access_token;
  if (typeof account.expires_at === "number") row.expires_at = account.expires_at;
  if (typeof account.token_type === "string") row.token_type = account.token_type;
  if (typeof account.scope === "string") row.scope = account.scope;
  if (typeof account.id_token === "string") row.id_token = account.id_token;
  if (typeof account.session_state === "string") row.session_state = account.session_state;
  return row as AdapterAccount;
}

export function createAuthAdapter(): Adapter {
  const base = KyselyAdapter(authDb());
  const ready = async () => {
    await ensureAuthTables();
  };

  return {
    ...base,
    async createUser(data) {
      await ready();
      return base.createUser!(cleanUser(data));
    },
    async getUser(id) {
      await ready();
      return base.getUser!(id);
    },
    async getUserByEmail(email) {
      await ready();
      return base.getUserByEmail!(email);
    },
    async getUserByAccount(providerAccountId) {
      await ready();
      return base.getUserByAccount!(providerAccountId);
    },
    async updateUser(user) {
      await ready();
      const data: Partial<AdapterUser> & Pick<AdapterUser, "id"> = { id: user.id };
      if (user.name !== undefined) data.name = user.name;
      if (user.email !== undefined) data.email = user.email;
      if (user.emailVerified !== undefined) data.emailVerified = user.emailVerified;
      if (user.image !== undefined) data.image = user.image;
      return base.updateUser!(data);
    },
    async linkAccount(account) {
      await ready();
      return base.linkAccount!(cleanAccount(account));
    },
    async createVerificationToken(verificationToken) {
      await ready();
      return base.createVerificationToken!(verificationToken);
    },
    async useVerificationToken(params) {
      await ready();
      return base.useVerificationToken!(params);
    },
  } as Adapter;
}
