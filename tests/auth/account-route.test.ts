import { beforeEach, describe, expect, it, vi } from "vitest";
const fake = vi.hoisted(() => ({
  client: vi.fn(),
  getUser: vi.fn(),
  findById: vi.fn(),
}));
vi.mock("../../src/integrations/supabase/server", () => ({
  createSupabaseServerClient: fake.client,
}));
vi.mock("../../src/modules/auth/accounts", () => ({
  accounts: { findById: fake.findById },
}));
import { GET } from "../../src/app/api/conta/[id]/route";
const id = "11111111-1111-4111-8111-111111111111";

beforeEach(() => {
  vi.clearAllMocks();
  fake.client.mockResolvedValue({ auth: { getUser: fake.getUser } });
  fake.getUser.mockResolvedValue({ data: { user: { id } }, error: null });
  fake.findById.mockResolvedValue({
    id,
    createdAt: new Date("2026-11-05T00:00:00Z"),
  });
});
function request(target = id) {
  return GET(new Request(`http://localhost/api/conta/${target}`), {
    params: Promise.resolve({ id: target }),
  });
}

describe("Endpoint de conta", () => {
  it("responde 401 sem sessão, mesmo acessando a rota diretamente", async () => {
    fake.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const response = await request();
    expect(response.status).toBe(401);
    expect(fake.findById).not.toHaveBeenCalled();
  });
  it("responde 404 ao tentar acessar outra conta", async () => {
    const response = await request("22222222-2222-4222-8222-222222222222");
    expect(response.status).toBe(404);
    expect(fake.findById).not.toHaveBeenCalled();
  });
  it("retorna somente a conta autenticada sem cache compartilhado", async () => {
    const response = await request();
    expect(response.status).toBe(200);
    expect((await response.json()).id).toBe(id);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
  it("retorna erro genérico quando a persistência está indisponível", async () => {
    fake.findById.mockRejectedValue(new Error("credenciais internas"));
    const response = await request();
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain(
      "credenciais internas",
    );
  });
});
