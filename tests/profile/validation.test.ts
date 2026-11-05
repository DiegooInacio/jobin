import { describe, expect, it } from "vitest";
import { profileDraft } from "../../src/modules/profile/model";
import { validateProfile } from "../../src/modules/profile/validation";
import { profileForm, profileInput } from "./fixtures";

describe("Validação do perfil", () => {
  it("aceita dados completos e converte remuneração sem arredondamento", () => {
    const result = validateProfile(profileForm());
    expect(result).toEqual({ success: true, data: profileInput });
  });
  it("exige nome e título, inclusive contra espaços em branco", () => {
    const result = validateProfile(
      profileForm({ fullName: "  ", headline: "" }),
    );
    expect(result.success).toBe(false);
    if (!result.success)
      expect(Object.keys(result.errors)).toEqual(
        expect.arrayContaining(["fullName", "headline"]),
      );
  });
  it("preserva campos ausentes como não informados", () => {
    const form = new FormData();
    form.set("fullName", "Ana");
    form.set("headline", "Desenvolvedora");
    const result = validateProfile(form);
    expect(result.success).toBe(true);
    if (result.success)
      expect(result.data).toMatchObject({
        skills: [],
        desiredRoles: [],
        preferredLocations: [],
        workModes: [],
        employmentTypes: [],
        experienceLevel: "unspecified",
        minimumSalaryCents: null,
      });
  });
  it("normaliza listas, remove repetições e mantém vírgulas nas localidades", () => {
    const result = validateProfile(
      profileForm({
        skills: " React, react; TypeScript\n TYPESCRIPT, ",
        preferredLocations: "Fortaleza, CE; São Paulo, SP\nFORTALEZA, CE",
      }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.skills).toEqual(["React", "TypeScript"]);
      expect(result.data.preferredLocations).toEqual([
        "Fortaleza, CE",
        "São Paulo, SP",
      ]);
      expect(profileDraft(result.data).preferredLocations).toBe(
        "Fortaleza, CE; São Paulo, SP",
      );
    }
  });
  it("rejeita comprimentos e quantidades excessivos sem truncar dados", () => {
    const result = validateProfile(
      profileForm({
        fullName: "a".repeat(101),
        headline: "a".repeat(141),
        summary: "a".repeat(3001),
        skills: Array.from({ length: 31 }, (_, index) => `Skill ${index}`).join(
          ",",
        ),
        desiredRoles: ["a".repeat(101)].join(","),
      }),
    );
    expect(result.success).toBe(false);
    if (!result.success)
      expect(Object.keys(result.errors)).toEqual(
        expect.arrayContaining([
          "fullName",
          "headline",
          "summary",
          "skills",
          "desiredRoles",
        ]),
      );
  });
  it("rejeita opções forjadas em seletores e checkboxes", () => {
    const result = validateProfile(
      profileForm({
        experienceLevel: "administrador",
        workModes: ["remote", "invalido"],
        employmentTypes: ["outro"],
      }),
    );
    expect(result.success).toBe(false);
    if (!result.success)
      expect(Object.keys(result.errors)).toEqual(
        expect.arrayContaining([
          "experienceLevel",
          "workModes",
          "employmentTypes",
        ]),
      );
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,exemplo",
    "https://usuario:senha@exemplo.com",
    "linkedin.com/in/exemplo",
  ])("rejeita URL insegura ou incompleta: %s", (value) => {
    const result = validateProfile(profileForm({ linkedinUrl: value }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.linkedinUrl).toBeTruthy();
  });
  it.each([
    ["0", 0],
    ["0,29", 29],
    ["8500.9", 850090],
    ["9999999,99", 999999999],
  ])("converte %s em centavos", (value, cents) => {
    const result = validateProfile(
      profileForm({ minimumSalary: String(value) }),
    );
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.minimumSalaryCents).toBe(cents);
  });
  it.each(["-1", "1.000,00", "1e4", "50,123", "NaN", "10000000"])(
    "rejeita remuneração inválida: %s",
    (value) => {
      const result = validateProfile(profileForm({ minimumSalary: value }));
      expect(result.success).toBe(false);
      if (!result.success) expect(result.errors.minimumSalary).toBeTruthy();
    },
  );
  it("ignora campos de propriedade e rejeita arquivos em campos de texto", () => {
    const form = profileForm({
      userId: "outro-usuario",
      createdAt: "data-forjada",
    });
    const result = validateProfile(form);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).not.toHaveProperty("userId");
    form.set("fullName", new Blob(["arquivo"]));
    expect(validateProfile(form).success).toBe(false);
  });
});
