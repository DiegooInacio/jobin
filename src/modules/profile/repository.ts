import "server-only";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { professionalProfiles } from "@/db/schema";
import type { ProfileRepository } from "./model";

export const profileRepository: ProfileRepository = {
  async findByUserId(userId) {
    const rows = await getDb()
      .select()
      .from(professionalProfiles)
      .where(eq(professionalProfiles.userId, userId))
      .limit(1);
    return rows[0] ?? null;
  },
  async save(userId, data) {
    const values = {
      fullName: data.fullName,
      headline: data.headline,
      location: data.location,
      summary: data.summary,
      experienceLevel: data.experienceLevel,
      skills: data.skills,
      desiredRoles: data.desiredRoles,
      preferredLocations: data.preferredLocations,
      workModes: data.workModes,
      employmentTypes: data.employmentTypes,
      minimumSalaryCents: data.minimumSalaryCents,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl,
    };
    await getDb()
      .insert(professionalProfiles)
      .values({ ...values, userId })
      .onConflictDoUpdate({
        target: professionalProfiles.userId,
        set: { ...values, updatedAt: sql`clock_timestamp()` },
      });
  },
};
