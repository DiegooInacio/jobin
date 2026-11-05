import type { EventEmitter } from "node:events";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const fake = vi.hoisted(() => ({ created: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("pg", async () => {
  const { EventEmitter } = await import("node:events");
  return {
    Pool: class extends EventEmitter {
      constructor(options: unknown) {
        super();
        fake.created(options);
      }
    },
  };
});
import { getDb } from "../../src/db/client";
const globalPool = globalThis as typeof globalThis & {
  jobinPool?: EventEmitter;
};
beforeEach(() => {
  delete globalPool.jobinPool;
  vi.clearAllMocks();
  vi.stubEnv("DATABASE_URL", "postgresql://jobin:local@localhost/jobin");
});
afterEach(() => {
  delete globalPool.jobinPool;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Falha de conexão ociosa", () => {
  it("não encerra o processo nem acumula handlers quando o pool é reutilizado", () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    getDb();
    getDb();
    const pool = globalPool.jobinPool;
    expect(pool).toBeDefined();
    if (!pool) throw new Error("Pool não criado");
    expect(() =>
      pool.emit("error", new Error("detalhe sensível da conexão")),
    ).not.toThrow();
    expect(fake.created).toHaveBeenCalledOnce();
    expect(pool.listenerCount("error")).toBe(1);
    expect(errorLog).toHaveBeenCalledOnce();
    expect(JSON.stringify(errorLog.mock.calls)).not.toContain("sensível");
  });
});
