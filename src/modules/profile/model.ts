export const experienceLevels = [
  "unspecified",
  "internship",
  "junior",
  "mid",
  "senior",
  "lead",
] as const;
export const workModes = ["remote", "hybrid", "onsite"] as const;
export const employmentTypes = [
  "clt",
  "contract",
  "internship",
  "temporary",
] as const;
export const experienceLabels = {
  unspecified: "Não informado",
  internship: "Estágio",
  junior: "Júnior",
  mid: "Pleno",
  senior: "Sênior",
  lead: "Liderança",
};
export const workModeLabels = {
  remote: "Remoto",
  hybrid: "Híbrido",
  onsite: "Presencial",
};
export const employmentLabels = {
  clt: "CLT",
  contract: "PJ",
  internship: "Estágio",
  temporary: "Temporário",
};

export type ProfileInput = {
  fullName: string;
  headline: string;
  location: string;
  summary: string;
  experienceLevel: (typeof experienceLevels)[number];
  skills: string[];
  desiredRoles: string[];
  preferredLocations: string[];
  workModes: (typeof workModes)[number][];
  employmentTypes: (typeof employmentTypes)[number][];
  minimumSalaryCents: number | null;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
};
export type ProfileRecord = ProfileInput & {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type ProfileDraft = Omit<
  ProfileInput,
  "skills" | "desiredRoles" | "preferredLocations" | "minimumSalaryCents"
> & {
  skills: string;
  desiredRoles: string;
  preferredLocations: string;
  minimumSalary: string;
};
export type ProfileField = keyof ProfileDraft;
export type ProfileFormState = {
  status: "idle" | "saved" | "invalid" | "error" | "unauthorized";
  message?: string;
  errors?: Partial<Record<ProfileField, string>>;
  values?: ProfileDraft;
};
export type ProfileRepository = {
  findByUserId(userId: string): Promise<ProfileRecord | null>;
  save(userId: string, data: ProfileInput): Promise<void>;
};

export function profileDraft(profile: ProfileInput | null): ProfileDraft {
  return {
    fullName: profile?.fullName ?? "",
    headline: profile?.headline ?? "",
    location: profile?.location ?? "",
    summary: profile?.summary ?? "",
    experienceLevel: profile?.experienceLevel ?? "unspecified",
    skills: profile?.skills.join(", ") ?? "",
    desiredRoles: profile?.desiredRoles.join(", ") ?? "",
    preferredLocations: profile?.preferredLocations.join("; ") ?? "",
    workModes: profile?.workModes ?? [],
    employmentTypes: profile?.employmentTypes ?? [],
    minimumSalary:
      profile?.minimumSalaryCents == null
        ? ""
        : (profile.minimumSalaryCents / 100).toFixed(2).replace(".", ","),
    linkedinUrl: profile?.linkedinUrl ?? "",
    githubUrl: profile?.githubUrl ?? "",
    portfolioUrl: profile?.portfolioUrl ?? "",
  };
}
