import { beforeEach, describe, expect, it, vi } from "vitest";
const fake = vi.hoisted(() => ({
  session: vi.fn(),
  save: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("../../src/modules/auth/session", () => ({
  currentIdentity: fake.session,
}));
vi.mock("../../src/modules/profile/repository", () => ({
  profileRepository: { save: fake.save },
}));
vi.mock("next/cache", () => ({ revalidatePath: fake.revalidate }));
import { saveProfile } from "../../src/modules/profile/actions";
import { profileForm } from "./fixtures";
beforeEach(() => {
  vi.clearAllMocks();
  fake.session.mockResolvedValue({
    id: "11111111-1111-4111-8111-111111111111",
  });
  fake.save.mockResolvedValue(undefined);
});

describe("Ação de salvar perfil", () => {
  it("invalida a página após salvar e usa a sessão do servidor", async () => {
    expect((await saveProfile({ status: "idle" }, profileForm())).status).toBe(
      "saved",
    );
    expect(fake.session).toHaveBeenCalledOnce();
    expect(fake.revalidate).toHaveBeenCalledWith("/perfil");
  });
  it("não invalida a página ou grava dados se a sessão expirou", async () => {
    fake.session.mockResolvedValue(null);
    expect((await saveProfile({ status: "idle" }, profileForm())).status).toBe(
      "unauthorized",
    );
    expect(fake.save).not.toHaveBeenCalled();
    expect(fake.revalidate).not.toHaveBeenCalled();
  });
  it("não invalida a página quando a persistência falha", async () => {
    fake.save.mockRejectedValue(new Error("falha no banco"));
    expect((await saveProfile({ status: "idle" }, profileForm())).status).toBe(
      "error",
    );
    expect(fake.revalidate).not.toHaveBeenCalled();
  });
});
