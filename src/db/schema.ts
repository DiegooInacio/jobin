import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  employmentTypes,
  experienceLevels,
  workModes,
} from "../modules/profile/model";

// O UUID é fornecido pelo Supabase Auth; o backend sincroniza a identidade validada.
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}).enableRLS();

export const experienceLevelEnum = pgEnum("experience_level", experienceLevels);
export const workModeEnum = pgEnum("work_mode", workModes);
export const employmentTypeEnum = pgEnum("employment_type", employmentTypes);

export const professionalProfiles = pgTable(
  "professional_profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    headline: varchar("headline", { length: 140 }).notNull(),
    location: varchar("location", { length: 120 }).notNull().default(""),
    summary: varchar("summary", { length: 3000 }).notNull().default(""),
    experienceLevel: experienceLevelEnum("experience_level")
      .notNull()
      .default("unspecified"),
    skills: text("skills").array().notNull().default([]),
    desiredRoles: text("desired_roles").array().notNull().default([]),
    preferredLocations: text("preferred_locations")
      .array()
      .notNull()
      .default([]),
    workModes: workModeEnum("work_modes").array().notNull().default([]),
    employmentTypes: employmentTypeEnum("employment_types")
      .array()
      .notNull()
      .default([]),
    minimumSalaryCents: integer("minimum_salary_cents"),
    linkedinUrl: varchar("linkedin_url", { length: 500 }).notNull().default(""),
    githubUrl: varchar("github_url", { length: 500 }).notNull().default(""),
    portfolioUrl: varchar("portfolio_url", { length: 500 })
      .notNull()
      .default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("profile_name_not_blank", sql`length(trim(${table.fullName})) > 0`),
    check(
      "profile_headline_not_blank",
      sql`length(trim(${table.headline})) > 0`,
    ),
    check("profile_salary_nonnegative", sql`${table.minimumSalaryCents} >= 0`),
    check("profile_skills_limit", sql`cardinality(${table.skills}) <= 30`),
    check("profile_roles_limit", sql`cardinality(${table.desiredRoles}) <= 10`),
    check(
      "profile_locations_limit",
      sql`cardinality(${table.preferredLocations}) <= 10`,
    ),
  ],
).enableRLS();
