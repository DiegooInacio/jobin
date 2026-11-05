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
import { users } from "../../src/db/schema";
import {
  readMyProfile,
  saveMyProfile,
} from "../../src/modules/profile/service";
import { profileForm, profileInput } from "../profile/fixtures";

let pool: Pool;
let client: PoolClient | undefined;
let alice: string;
let bob: string;
vi.mock("server-only", () => ({}));
vi.mock("../../src/db/client", () => ({
  getDb: () => {
    if (!client) throw new Error("Transação de teste ausente");
    return drizzle(client);
  },
}));
import { profileRepository } from "../../src/modules/profile/repository";
const aliceSession = async () => ({ id: alice });
const bobSession = async () => ({ id: bob });

beforeAll(async () => {
  pool = new Pool({
    connectionString: getDatabaseUrl("TEST_DATABASE_URL"),
    max: 1,
    connectionTimeoutMillis: 5_000,
  });
  await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
});
beforeEach(async () => {
  client = undefined;
  client = await pool.connect();
  await client.query("BEGIN");
  alice = randomUUID();
  bob = randomUUID();
  await drizzle(client)
    .insert(users)
    .values([{ id: alice }, { id: bob }]);
});
afterEach(async () => {
  if (client) {
    try {
      await client.query("ROLLBACK");
    } finally {
      client.release();
      client = undefined;
    }
  }
});
afterAll(async () => {
  await pool?.end();
});

describe("Perfil persistido no PostgreSQL", () => {
  it("cadastra e recarrega o perfil completo", async () => {
    expect(
      (await saveMyProfile(aliceSession, profileRepository, profileForm()))
        .status,
    ).toBe("saved");
    const result = await readMyProfile(aliceSession, profileRepository);
    expect(result.status).toBe("ok");
    if (result.status === "ok")
      expect(result.profile).toMatchObject({
        ...profileInput,
        userId: alice,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
  });
  it("edita sem duplicar o perfil ou alterar sua data de criação", async () => {
    await profileRepository.save(alice, profileInput);
    const before = await profileRepository.findByUserId(alice);
    await saveMyProfile(
      aliceSession,
      profileRepository,
      profileForm({
        headline: "Engenheira de Software",
        minimumSalary: "",
        skills: "",
        workModes: [],
      }),
    );
    const after = await profileRepository.findByUserId(alice);
    expect(after).toMatchObject({
      headline: "Engenheira de Software",
      minimumSalaryCents: null,
      skills: [],
      workModes: [],
      createdAt: before?.createdAt,
    });
    const count = await client!.query(
      "SELECT count(*)::int AS total FROM professional_profiles WHERE user_id = $1",
      [alice],
    );
    expect(count.rows[0].total).toBe(1);
  });
  it("isola leitura e escrita entre duas contas mesmo com proprietário forjado no formulário", async () => {
    await saveMyProfile(aliceSession, profileRepository, profileForm());
    await saveMyProfile(
      bobSession,
      profileRepository,
      profileForm({ fullName: "Bruno", headline: "Designer" }),
    );
    await saveMyProfile(
      aliceSession,
      profileRepository,
      profileForm({ fullName: "Ana atualizada", userId: bob }),
    );
    const profileAlice = await readMyProfile(aliceSession, profileRepository);
    const profileBob = await readMyProfile(bobSession, profileRepository);
    expect(profileAlice.status === "ok" && profileAlice.profile?.fullName).toBe(
      "Ana atualizada",
    );
    expect(profileBob.status === "ok" && profileBob.profile?.fullName).toBe(
      "Bruno",
    );
  });
  it("não permite trocar proprietário ou datas por propriedades extras na persistência", async () => {
    await profileRepository.save(alice, profileInput);
    await profileRepository.save(bob, { ...profileInput, fullName: "Bruno" });
    const before = await profileRepository.findByUserId(alice);
    const injected = {
      ...profileInput,
      userId: bob,
      createdAt: new Date("2000-01-01"),
      updatedAt: new Date("2000-01-01"),
    };
    await profileRepository.save(alice, injected);
    expect(await profileRepository.findByUserId(alice)).toMatchObject({
      userId: alice,
      createdAt: before?.createdAt,
    });
    expect((await profileRepository.findByUserId(bob))?.fullName).toBe("Bruno");
  });
  it("não grava um perfil inválido nem substitui valores anteriores", async () => {
    await profileRepository.save(alice, profileInput);
    expect(
      (
        await saveMyProfile(
          aliceSession,
          profileRepository,
          profileForm({ fullName: "", minimumSalary: "-10" }),
        )
      ).status,
    ).toBe("invalid");
    expect((await profileRepository.findByUserId(alice))?.fullName).toBe(
      profileInput.fullName,
    );
  });
  it("exige usuário existente por chave estrangeira", async () => {
    await expect(
      client!.query(
        "INSERT INTO professional_profiles (user_id, full_name, headline) VALUES ($1, 'Nome', 'Cargo')",
        [randomUUID()],
      ),
    ).rejects.toMatchObject({ code: "23503" });
  });
  it.each([
    ["full_name", "   ", "23514"],
    ["minimum_salary_cents", -1, "23514"],
    ["experience_level", "invalido", "22P02"],
  ])("rejeita valor inválido na coluna %s", async (field, value, code) => {
    // A coluna vem exclusivamente da lista de casos estática, nunca de entrada externa.
    const insert = `INSERT INTO professional_profiles (user_id, full_name, headline${field === "full_name" ? "" : `, ${field}`}) VALUES ($1, $2, 'Cargo'${field === "full_name" ? "" : ", $3"})`;
    await expect(
      client!.query(
        insert,
        field === "full_name" ? [alice, value] : [alice, "Ana", value],
      ),
    ).rejects.toMatchObject({ code });
  });
  it("limita o perfil a um registro por usuário", async () => {
    await profileRepository.save(alice, profileInput);
    await expect(
      client!.query(
        "INSERT INTO professional_profiles (user_id, full_name, headline) VALUES ($1, 'Nome', 'Cargo')",
        [alice],
      ),
    ).rejects.toMatchObject({ code: "23505" });
  });
  it("remove o perfil em cascata sem afetar outra conta", async () => {
    await profileRepository.save(alice, profileInput);
    await profileRepository.save(bob, profileInput);
    await client!.query("DELETE FROM users WHERE id = $1", [alice]);
    expect(await profileRepository.findByUserId(alice)).toBeNull();
    expect(await profileRepository.findByUserId(bob)).not.toBeNull();
  });
  it("mantém RLS habilitada e sem acesso direto público", async () => {
    const result = await client!.query(
      "SELECT relrowsecurity FROM pg_class WHERE oid = 'public.professional_profiles'::regclass",
    );
    expect(result.rows[0].relrowsecurity).toBe(true);
    const policies = await client!.query(
      "SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'professional_profiles'",
    );
    expect(policies.rows).toEqual([]);
  });
});
