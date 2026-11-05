import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const fake = vi.hoisted(() => ({ create: vi.fn(), getUser: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: fake.create }));
import { updateSession } from "../../src/integrations/supabase/middleware";

type CookiesAdapter = {
  cookies: {
    setAll(
      cookies: {
        name: string;
        value: string;
        options: { path: string; httpOnly: boolean };
      }[],
    ): void;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://projeto.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_exemplo");
  fake.getUser.mockResolvedValue({ data: { user: null }, error: null });
  fake.create.mockReturnValue({ auth: { getUser: fake.getUser } });
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Proteção de páginas e renovação de cookies", () => {
  it("redireciona a visita direta a página privada e preserva o destino interno", async () => {
    const response = await updateSession(
      new NextRequest("http://localhost/perfil"),
    );
    const location = new URL(response.headers.get("location")!);
    expect(response.status).toBe(307);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("next")).toBe("/perfil");
  });
  it("responde 401 na API sem transformar a resposta em HTML de login", async () => {
    const response = await updateSession(
      new NextRequest("http://localhost/api/conta/id"),
    );
    expect(response.status).toBe(401);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  it("envia uma sessão válida para um destino interno seguro após visitar o login", async () => {
    fake.getUser.mockResolvedValue({
      data: { user: { id: "11111111-1111-4111-8111-111111111111" } },
      error: null,
    });
    const response = await updateSession(
      new NextRequest("http://localhost/login?next=https://externo.com"),
    );
    expect(response.headers.get("location")).toBe("http://localhost/");
  });
  it("preserva cookies renovados no redirecionamento", async () => {
    fake.create.mockImplementation(
      (_url: string, _key: string, options: CookiesAdapter) => {
        options.cookies.setAll([
          {
            name: "sb-teste",
            value: "atualizado",
            options: { path: "/", httpOnly: true },
          },
        ]);
        return { auth: { getUser: fake.getUser } };
      },
    );
    const request = new NextRequest("http://localhost/perfil");
    const response = await updateSession(request);
    expect(request.cookies.get("sb-teste")?.value).toBe("atualizado");
    expect(response.cookies.get("sb-teste")?.value).toBe("atualizado");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  });
  it("mantém o login acessível e as páginas privadas fechadas sem configuração", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(
      (await updateSession(new NextRequest("http://localhost/login"))).status,
    ).toBe(200);
    expect(
      (await updateSession(new NextRequest("http://localhost/"))).status,
    ).toBe(307);
    expect(fake.create).not.toHaveBeenCalled();
  });
});
