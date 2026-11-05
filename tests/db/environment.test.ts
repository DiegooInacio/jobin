import { afterEach, describe, expect, it, vi } from "vitest";
import { getDatabaseUrl } from "../../src/db/environment";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Configuração de banco", () => {
  it("exige uma URL explícita sem divulgar credenciais no erro", () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(() => getDatabaseUrl()).toThrow("Configure DATABASE_URL");
    vi.stubEnv("DATABASE_URL", "https://usuario:segredo@localhost/jobin");
    expect(() => getDatabaseUrl()).toThrow("URL PostgreSQL válida");
  });

  it("impede executar testes contra o banco de desenvolvimento", () => {
    vi.stubEnv(
      "TEST_DATABASE_URL",
      "postgresql://jobin:local@localhost:5433/jobin",
    );
    expect(() => getDatabaseUrl("TEST_DATABASE_URL")).toThrow(
      "banco dedicado jobin_test",
    );
  });

  it("aceita o banco dedicado de testes", () => {
    const url = "postgresql://jobin:local@localhost:5434/jobin_test";
    vi.stubEnv("TEST_DATABASE_URL", url);
    expect(getDatabaseUrl("TEST_DATABASE_URL")).toBe(url);
  });
});
