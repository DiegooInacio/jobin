import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabaseConfig } from "../../src/integrations/supabase/config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Configuração do Supabase", () => {
  it("exige configuração explícita", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(() => getSupabaseConfig()).toThrow("Configure");
  });
  it("aceita projeto HTTPS com chave publicável", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://projeto.supabase.co");
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_exemplo",
    );
    expect(getSupabaseConfig().url).toBe("https://projeto.supabase.co");
  });
  it("permite HTTP apenas no ambiente local e rejeita chave secreta", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_exemplo",
    );
    expect(getSupabaseConfig().url).toContain("127.0.0.1");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://projeto.supabase.co");
    expect(() => getSupabaseConfig()).toThrow("URL do Supabase inválida");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://projeto.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_secret_nao_usar");
    expect(() => getSupabaseConfig()).toThrow("chave publicável");
  });
});
