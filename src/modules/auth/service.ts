import type { Credentials } from "./credentials";

export type Identity = { id: string; email?: string };
export type Account = { id: string; createdAt: Date };
export type AuthGateway = {
  getUser(): Promise<{ data: { user: Identity | null }; error: unknown }>;
  signInWithPassword(
    credentials: Credentials,
  ): Promise<{ data: { user: Identity | null }; error: unknown }>;
  signOut(options: { scope: "local" }): Promise<{ error: unknown }>;
};
export type AccountStore = {
  ensureUser(id: string): Promise<void>;
  findById(id: string): Promise<Account | null>;
};

export async function verifiedIdentity(auth: Pick<AuthGateway, "getUser">) {
  try {
    const { data, error } = await auth.getUser();
    if (
      error ||
      !data.user ||
      !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(data.user.id)
    )
      return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function signInAccount(
  auth: AuthGateway,
  store: AccountStore,
  credentials: Credentials,
) {
  try {
    const { data, error } = await auth.signInWithPassword(credentials);
    if (error || !data.user)
      return {
        error:
          "E-mail ou senha inválidos. Confira seus dados e tente novamente.",
      };
    // Confirma a identidade com o provedor, sem confiar no conteúdo de cookies.
    const identity = await verifiedIdentity(auth);
    if (!identity || identity.id !== data.user.id)
      throw new Error("Identidade inválida");
    await store.ensureUser(identity.id);
    return {};
  } catch {
    // Não mantém uma sessão parcialmente criada se a sincronização local falhar.
    await auth.signOut({ scope: "local" }).catch(() => undefined);
    return {
      error: "Não foi possível entrar agora. Tente novamente em instantes.",
    };
  }
}

export async function ownedAccount(
  auth: Pick<AuthGateway, "getUser">,
  store: Pick<AccountStore, "findById">,
  requestedId: string,
) {
  const identity = await verifiedIdentity(auth);
  if (!identity) return { status: 401 as const };
  // Mesmo com conexão privilegiada, nenhum identificador externo muda o proprietário.
  if (identity.id !== requestedId) return { status: 404 as const };
  const account = await store.findById(identity.id);
  if (!account || account.id !== identity.id) return { status: 404 as const };
  return { status: 200 as const, account };
}
