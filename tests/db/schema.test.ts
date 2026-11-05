import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool, type PoolClient } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getDatabaseUrl } from "../../src/db/environment";
import { users } from "../../src/db/schema";

let pool: Pool;

async function inTransaction(run: (client: PoolClient) => Promise<void>) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await run(client);
  } finally {
    try {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }
}

beforeAll(async () => {
  pool = new Pool({
    connectionString: getDatabaseUrl("TEST_DATABASE_URL"),
    max: 1,
    connectionTimeoutMillis: 5_000,
  });
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
});

afterAll(async () => {
  await pool?.end();
});

describe("Esquema inicial no PostgreSQL dedicado", () => {
  it("reaplica migrations sem recriar tabelas ou duplicar o histórico", async () => {
    const before = await pool.query(
      "SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations",
    );
    await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
    const after = await pool.query(
      "SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations",
    );
    expect(before.rows[0].count).toBeGreaterThan(0);
    expect(after.rows).toEqual(before.rows);
  });

  it("armazena o UUID de autenticação e preenche a data de criação", async () => {
    await inTransaction(async (client) => {
      const id = randomUUID();
      const result = await drizzle(client)
        .insert(users)
        .values({ id })
        .returning();
      expect(result[0].id).toBe(id);
      expect(result[0].createdAt).toBeInstanceOf(Date);
    });
  });

  it("rejeita identificadores duplicados", async () => {
    await inTransaction(async (client) => {
      const id = randomUUID();
      await client.query("INSERT INTO public.users (id) VALUES ($1)", [id]);
      await expect(
        client.query("INSERT INTO public.users (id) VALUES ($1)", [id]),
      ).rejects.toMatchObject({ code: "23505" });
    });
  });

  it("exige identificador e data de criação", async () => {
    await inTransaction(async (client) => {
      await expect(
        client.query("INSERT INTO public.users DEFAULT VALUES"),
      ).rejects.toMatchObject({ code: "23502" });
    });
    await inTransaction(async (client) => {
      await expect(
        client.query(
          "INSERT INTO public.users (id, created_at) VALUES ($1, NULL)",
          [randomUUID()],
        ),
      ).rejects.toMatchObject({ code: "23502" });
    });
  });

  it("habilita RLS sem conceder acesso antecipado a usuários", async () => {
    const table = await pool.query(
      "SELECT relrowsecurity FROM pg_class WHERE oid = 'public.users'::regclass",
    );
    expect(table.rows[0].relrowsecurity).toBe(true);
    const policies = await pool.query(
      "SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users'",
    );
    expect(policies.rows).toEqual([]);
  });
});
