import {
  employmentTypes,
  experienceLevels,
  workModes,
  type ProfileField,
  type ProfileInput,
} from "./model";

export function validateProfile(
  form: FormData,
):
  | { success: true; data: ProfileInput }
  | { success: false; errors: Partial<Record<ProfileField, string>> } {
  const errors: Partial<Record<ProfileField, string>> = {};
  function text(field: ProfileField, limit: number, required = false) {
    const raw = form.get(field);
    if (raw !== null && typeof raw !== "string") {
      errors[field] = "Informe um texto válido.";
      return "";
    }
    const value = (raw ?? "").trim();
    if (required && !value) errors[field] = "Preencha este campo.";
    else if (value.length > limit)
      errors[field] = `Use no máximo ${limit} caracteres.`;
    else if (value.includes("\0"))
      errors[field] = "Remova os caracteres inválidos.";
    return value;
  }
  function list(
    field: "skills" | "desiredRoles" | "preferredLocations",
    max: number,
    length: number,
  ) {
    const value = text(field, max * (length + 2));
    const unique = new Map<string, string>();
    for (const item of value.split(
      field === "preferredLocations" ? /[;\n]/ : /[,;\n]/,
    )) {
      const cleaned = item.trim().replace(/\s+/g, " ");
      if (!cleaned) continue;
      if (cleaned.length > length)
        errors[field] = `Cada item pode ter até ${length} caracteres.`;
      const key = cleaned.normalize("NFKC").toLocaleLowerCase("pt-BR");
      if (!unique.has(key)) unique.set(key, cleaned);
    }
    if (unique.size > max) errors[field] = `Informe no máximo ${max} itens.`;
    return [...unique.values()];
  }
  function choices<T extends string>(
    field: "workModes" | "employmentTypes",
    allowed: readonly T[],
  ): T[] {
    const values = form.getAll(field);
    if (
      values.some(
        (value) => typeof value !== "string" || !allowed.includes(value as T),
      )
    )
      errors[field] = "Selecione apenas as opções disponíveis.";
    return [
      ...new Set(
        values.filter((value): value is string => typeof value === "string"),
      ),
    ] as T[];
  }
  function link(field: "linkedinUrl" | "githubUrl" | "portfolioUrl") {
    const value = text(field, 500);
    if (!value) return "";
    try {
      const url = new URL(value);
      if (
        !["https:", "http:"].includes(url.protocol) ||
        !url.hostname ||
        url.username ||
        url.password
      )
        throw new Error();
    } catch {
      errors[field] =
        "Use um endereço completo começando com https:// ou http://.";
    }
    return value;
  }
  const level = text("experienceLevel", 20) || "unspecified";
  if (!experienceLevels.includes(level as (typeof experienceLevels)[number]))
    errors.experienceLevel = "Selecione um nível válido.";
  const salary = text("minimumSalary", 15);
  let minimumSalaryCents: number | null = null;
  if (salary) {
    if (!/^\d{1,7}([.,]\d{1,2})?$/.test(salary))
      errors.minimumSalary =
        "Use um valor a partir de zero, sem milhar e com até duas casas decimais.";
    else {
      const [whole, fraction = ""] = salary.replace(",", ".").split(".");
      minimumSalaryCents =
        Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    }
  }
  const data: ProfileInput = {
    fullName: text("fullName", 100, true),
    headline: text("headline", 140, true),
    location: text("location", 120),
    summary: text("summary", 3000),
    experienceLevel: level as ProfileInput["experienceLevel"],
    skills: list("skills", 30, 50),
    desiredRoles: list("desiredRoles", 10, 100),
    preferredLocations: list("preferredLocations", 10, 120),
    workModes: choices("workModes", workModes),
    employmentTypes: choices("employmentTypes", employmentTypes),
    minimumSalaryCents,
    linkedinUrl: link("linkedinUrl"),
    githubUrl: link("githubUrl"),
    portfolioUrl: link("portfolioUrl"),
  };
  return Object.keys(errors).length
    ? { success: false, errors }
    : { success: true, data };
}
