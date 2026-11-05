import { describe, expect, it, vi } from "vitest";
import {
  readMyProfile,
  saveMyProfile,
} from "../../src/modules/profile/service";
import type { ProfileRepository } from "../../src/modules/profile/model";
import { profileForm, profileInput } from "./fixtures";
const alice = "11111111-1111-4111-8111-111111111111";
const bob = "22222222-2222-4222-8222-222222222222";
const session = async () => ({ id: alice });
function repository() {
  return {
    save: vi.fn<ProfileRepository["save"]>().mockResolvedValue(undefined),
    findByUserId: vi
      .fn<ProfileRepository["findByUserId"]>()
      .mockResolvedValue(null),
  };
}

describe("Casos de uso do perfil", () => {
  it("salva apenas na conta da sessão, ignorando proprietário forjado", async () => {
    const store = repository();
    const result = await saveMyProfile(
      session,
      store,
      profileForm({ userId: bob }),
    );
    expect(result.status).toBe("saved");
    expect(store.save).toHaveBeenCalledWith(alice, profileInput);
    expect(result.values?.minimumSalary).toBe("8500,99");
  });
  it("nega leitura e gravação sem sessão antes de acessar o banco", async () => {
    const store = repository();
    expect(
      (await saveMyProfile(async () => null, store, profileForm())).status,
    ).toBe("unauthorized");
    expect(await readMyProfile(async () => null, store)).toEqual({
      status: "unauthorized",
    });
    expect(store.save).not.toHaveBeenCalled();
    expect(store.findByUserId).not.toHaveBeenCalled();
  });
  it("não persiste dados inválidos", async () => {
    const store = repository();
    const result = await saveMyProfile(
      session,
      store,
      profileForm({ fullName: "" }),
    );
    expect(result.status).toBe("invalid");
    expect(result.errors?.fullName).toBeTruthy();
    expect(store.save).not.toHaveBeenCalled();
  });
  it("consulta somente o usuário confirmado e aceita primeiro acesso vazio", async () => {
    const store = repository();
    expect(await readMyProfile(session, store)).toEqual({
      status: "ok",
      profile: null,
    });
    expect(store.findByUserId).toHaveBeenCalledWith(alice);
  });
  it("retorna erro sem expor detalhes do banco e sem indicar sucesso", async () => {
    const store = repository();
    store.save.mockRejectedValue(new Error("senha interna do banco"));
    const result = await saveMyProfile(session, store, profileForm());
    expect(result.status).toBe("error");
    expect(result.message).not.toContain("senha interna");
    expect(result.values).toBeUndefined();
  });
  it("não persiste quando a verificação da sessão falha", async () => {
    const store = repository();
    const result = await saveMyProfile(
      async () => {
        throw new Error("falha do provedor");
      },
      store,
      profileForm(),
    );
    expect(result.status).toBe("error");
    expect(store.save).not.toHaveBeenCalled();
  });
  it("permite limpar preferências sem confundir ausência com restrição", async () => {
    const store = repository();
    const form = profileForm({
      minimumSalary: "",
      skills: "",
      desiredRoles: "",
      preferredLocations: "",
      workModes: [],
      employmentTypes: [],
    });
    expect((await saveMyProfile(session, store, form)).status).toBe("saved");
    expect(store.save).toHaveBeenCalledWith(
      alice,
      expect.objectContaining({
        minimumSalaryCents: null,
        skills: [],
        desiredRoles: [],
        workModes: [],
        employmentTypes: [],
      }),
    );
  });
});
