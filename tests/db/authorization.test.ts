import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool, type PoolClient } from "pg";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { getDatabaseUrl } from "../../src/db/environment";
import { ownedAccount } from "../../src/modules/auth/service";

let pool: Pool;
let client: PoolClient;
vi.mock("server-only", () => ({}));
vi.mock("../../src/db/client", () => ({ getDb: () => drizzle(client) }));
import { accounts } from "../../src/modules/auth/accounts";

beforeAll(async () => {
  pool = new Pool({
    connectionString: getDatabaseUrl("TEST_DATABASE_URL"),
    max: 1,
    connectionTimeoutMillis: 5_000,
  });
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
});
beforeEach(async () => {
  client = await pool.connect();
  await client.query("BEGIN");
});
afterEach(async () => {
  if (client) {
    try {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }
});
afterAll(async () => {
  await pool?.end();
});

describe("Isolamento com PostgreSQL privilegiado", () => {
  it("mantém duas contas distintas e bloqueia a leitura cruzada", async () => {
    const alice = randomUUID();
    const bob = randomUUID();
    await accounts.ensureUser(alice);
    await accounts.ensureUser(bob);
    const aliceSession = {
      getUser: async () => ({ data: { user: { id: alice } }, error: null }),
    };
    const bobSession = {
      getUser: async () => ({ data: { user: { id: bob } }, error: null }),
    };
    expect((await ownedAccount(aliceSession, accounts, alice)).status).toBe(
      200,
    );
    expect((await ownedAccount(bobSession, accounts, bob)).status).toBe(200);
    expect(await ownedAccount(aliceSession, accounts, bob)).toEqual({
      status: 404,
    });
    expect(await ownedAccount(bobSession, accounts, alice)).toEqual({
      status: 404,
    });
  });
  it("sincroniza a mesma identidade sem duplicar ou alterar a data de criação", async () => {
    const id = randomUUID();
    await accounts.ensureUser(id);
    const before = await accounts.findById(id);
    await accounts.ensureUser(id);
    const after = await accounts.findById(id);
    expect(after).toEqual(before);
  });
});
