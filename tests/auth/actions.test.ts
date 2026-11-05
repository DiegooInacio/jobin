import { beforeEach, describe, expect, it, vi } from "vitest";

const fake = vi.hoisted(() => ({
  client: vi.fn(),
  getUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  ensureUser: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("../../src/integrations/supabase/server", () => ({
  createSupabaseServerClient: fake.client,
}));
vi.mock("../../src/modules/auth/accounts", () => ({
  accounts: { ensureUser: fake.ensureUser },
}));
vi.mock("next/cache", () => ({ revalidatePath: fake.revalidate }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));

import { signIn, signOut } from "../../src/modules/auth/actions";

beforeEach(() => {
  vi.clearAllMocks();
  const user = {
    id: "11111111-1111-4111-8111-111111111111",
    email: "pessoa@exemplo.com",
  };
  fake.client.mockResolvedValue({
    auth: {
      getUser: fake.getUser,
      signInWithPassword: fake.signIn,
      signOut: fake.signOut,
    },
  });
  fake.getUser.mockResolvedValue({ data: { user }, error: null });
  fake.signIn.mockResolvedValue({ data: { user }, error: null });
  fake.signOut.mockResolvedValue({ error: null });
  fake.ensureUser.mockResolvedValue(undefined);
});

describe("Ações de login e logout", () => {
  it("redireciona para destino interno após login e invalida o cache", async () => {
    const form = new FormData();
    form.set("email", "pessoa@exemplo.com");
    form.set("password", "senha");
    form.set("next", "/perfil");
    await expect(signIn({}, form)).rejects.toThrow("REDIRECT:/perfil");
    expect(fake.revalidate).toHaveBeenCalledWith("/", "layout");
  });
  it("não aceita redirecionamento externo enviado ao servidor", async () => {
    const form = new FormData();
    form.set("email", "pessoa@exemplo.com");
    form.set("password", "senha");
    form.set("next", "https://externo.com");
    await expect(signIn({}, form)).rejects.toThrow("REDIRECT:/");
  });
  it("rejeita dados inválidos sem chamar o provedor", async () => {
    expect((await signIn({}, new FormData())).error).toBeTruthy();
    expect(fake.client).not.toHaveBeenCalled();
  });
  it("encerra a sessão local e retorna ao login", async () => {
    await expect(signOut()).rejects.toThrow("REDIRECT:/login");
    expect(fake.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(fake.revalidate).toHaveBeenCalledWith("/", "layout");
  });
  it("não informa sucesso quando o provedor falha ao sair", async () => {
    fake.signOut.mockResolvedValue({ error: new Error("falha interna") });
    await expect(signOut()).rejects.toThrow("REDIRECT:/login?erro=saida");
    expect(fake.revalidate).not.toHaveBeenCalled();
  });
});
