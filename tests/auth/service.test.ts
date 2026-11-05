import { describe, expect, it, vi } from "vitest";
import {
  ownedAccount,
  signInAccount,
  verifiedIdentity,
  type AccountStore,
  type AuthGateway,
} from "../../src/modules/auth/service";

const alice = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "alice@exemplo.com",
};
const bob = {
  id: "22222222-2222-4222-8222-222222222222",
  email: "bob@exemplo.com",
};

function fixtures() {
  const auth = {
    getUser: vi
      .fn<AuthGateway["getUser"]>()
      .mockResolvedValue({ data: { user: alice }, error: null }),
    signInWithPassword: vi
      .fn<AuthGateway["signInWithPassword"]>()
      .mockResolvedValue({ data: { user: alice }, error: null }),
    signOut: vi.fn<AuthGateway["signOut"]>().mockResolvedValue({ error: null }),
  };
  const store = {
    ensureUser: vi
      .fn<AccountStore["ensureUser"]>()
      .mockResolvedValue(undefined),
    findById: vi.fn<AccountStore["findById"]>().mockResolvedValue({
      id: alice.id,
      createdAt: new Date("2026-11-05T00:00:00Z"),
    }),
  };
  return { auth, store };
}

describe("Autenticação e autorização", () => {
  it("confirma a identidade com o provedor antes de criar o usuário local", async () => {
    const { auth, store } = fixtures();
    const credentials = { email: alice.email, password: "senha" };
    expect(await signInAccount(auth, store, credentials)).toEqual({});
    expect(auth.signInWithPassword).toHaveBeenCalledWith(credentials);
    expect(auth.getUser).toHaveBeenCalledOnce();
    expect(store.ensureUser).toHaveBeenCalledWith(alice.id);
  });

  it("não cria conta quando a senha está incorreta e não expõe o erro do provedor", async () => {
    const { auth, store } = fixtures();
    auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: new Error("informação interna"),
    });
    const result = await signInAccount(auth, store, {
      email: alice.email,
      password: "errada",
    });
    expect(result.error).toContain("E-mail ou senha inválidos");
    expect(result.error).not.toContain("informação interna");
    expect(store.ensureUser).not.toHaveBeenCalled();
  });

  it("encerra a sessão parcial se o banco falhar", async () => {
    const { auth, store } = fixtures();
    store.ensureUser.mockRejectedValue(new Error("banco indisponível"));
    const result = await signInAccount(auth, store, {
      email: alice.email,
      password: "senha",
    });
    expect(result.error).toContain("Não foi possível entrar");
    expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });

  it("rejeita divergência entre o login e a identidade confirmada", async () => {
    const { auth, store } = fixtures();
    auth.getUser.mockResolvedValue({ data: { user: bob }, error: null });
    expect(
      (
        await signInAccount(auth, store, {
          email: alice.email,
          password: "senha",
        })
      ).error,
    ).toBeTruthy();
    expect(store.ensureUser).not.toHaveBeenCalled();
    expect(auth.signOut).toHaveBeenCalledOnce();
  });

  it("não aceita sessão expirada mesmo quando há um usuário no resultado", async () => {
    const { auth, store } = fixtures();
    auth.getUser.mockResolvedValue({
      data: { user: alice },
      error: new Error("token expirado"),
    });
    expect(await ownedAccount(auth, store, alice.id)).toEqual({ status: 401 });
    expect(store.findById).not.toHaveBeenCalled();
  });

  it("nega acesso sem sessão ou quando o provedor está indisponível", async () => {
    const { auth, store } = fixtures();
    auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect(await ownedAccount(auth, store, alice.id)).toEqual({ status: 401 });
    auth.getUser.mockRejectedValue(new Error("rede indisponível"));
    expect(await verifiedIdentity(auth)).toBeNull();
  });

  it("não consulta o banco ao receber o identificador de outra pessoa", async () => {
    const { auth, store } = fixtures();
    expect(await ownedAccount(auth, store, bob.id)).toEqual({ status: 404 });
    expect(store.findById).not.toHaveBeenCalled();
  });

  it("consulta somente o UUID da identidade confirmada", async () => {
    const { auth, store } = fixtures();
    const result = await ownedAccount(auth, store, alice.id);
    expect(result.status).toBe(200);
    expect(store.findById).toHaveBeenCalledWith(alice.id);
    expect(await ownedAccount(auth, store, "' OR true --")).toEqual({
      status: 404,
    });
    expect(store.findById).toHaveBeenCalledTimes(1);
  });

  it("retorna 404 para conta ausente ou divergente", async () => {
    const { auth, store } = fixtures();
    store.findById.mockResolvedValue(null);
    expect(await ownedAccount(auth, store, alice.id)).toEqual({ status: 404 });
    store.findById.mockResolvedValue({ id: bob.id, createdAt: new Date() });
    expect(await ownedAccount(auth, store, alice.id)).toEqual({ status: 404 });
  });
});
