import { describe, expect, it } from "vitest";
import {
  parseCredentials,
  safeReturnPath,
} from "../../src/modules/auth/credentials";

describe("Dados de login e retorno seguro", () => {
  it("normaliza apenas o e-mail e preserva a senha", () => {
    const form = new FormData();
    form.set("email", " pessoa@exemplo.com ");
    form.set("password", " senha com espaços ");
    form.set("userId", "id-forjado");
    expect(parseCredentials(form)).toEqual({
      email: "pessoa@exemplo.com",
      password: " senha com espaços ",
    });
  });

  it("rejeita campos ausentes, arquivo, e-mail inválido e senha excessiva", () => {
    const form = new FormData();
    expect(parseCredentials(form)).toBeNull();
    form.set("email", "invalido");
    form.set("password", "senha");
    expect(parseCredentials(form)).toBeNull();
    form.set("email", new Blob(["email"]));
    expect(parseCredentials(form)).toBeNull();
    form.set("email", "pessoa@exemplo.com");
    form.set("password", "a".repeat(1025));
    expect(parseCredentials(form)).toBeNull();
  });

  it.each([
    "//site-externo.com",
    "https://site-externo.com",
    "/\\site-externo.com",
    "/%2f%2fsite-externo.com",
    "/login",
    null,
    ["/perfil"],
  ])("bloqueia um destino não autorizado: %s", (value) => {
    expect(safeReturnPath(value)).toBe("/");
  });

  it.each(["/", "/perfil", "/curriculos", "/vagas"])(
    "permite a página interna %s",
    (value) => {
      expect(safeReturnPath(value)).toBe(value);
    },
  );
});
