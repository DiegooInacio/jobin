import type { ProfileInput } from "../../src/modules/profile/model";

export const profileInput: ProfileInput = {
  fullName: "Ana Silva",
  headline: "Desenvolvedora Front-end",
  location: "Fortaleza, CE",
  summary: "Experiência com aplicações web.",
  experienceLevel: "mid",
  skills: ["React", "TypeScript"],
  desiredRoles: ["Desenvolvedora React"],
  preferredLocations: ["Fortaleza, CE", "São Paulo, SP"],
  workModes: ["remote"],
  employmentTypes: ["clt"],
  minimumSalaryCents: 850099,
  linkedinUrl: "https://www.linkedin.com/in/exemplo",
  githubUrl: "https://github.com/exemplo",
  portfolioUrl: "https://exemplo.com",
};

export function profileForm(overrides: Record<string, string | string[]> = {}) {
  const form = new FormData();
  const values = {
    ...profileInput,
    skills: "React, TypeScript",
    desiredRoles: "Desenvolvedora React",
    preferredLocations: "Fortaleza, CE; São Paulo, SP",
    minimumSalary: "8500,99",
    ...overrides,
  };
  for (const [name, value] of Object.entries(values)) {
    if (name === "minimumSalaryCents") continue;
    if (Array.isArray(value)) value.forEach((item) => form.append(name, item));
    else form.set(name, String(value));
  }
  return form;
}
