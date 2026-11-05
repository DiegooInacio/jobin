CREATE TYPE "public"."employment_type" AS ENUM('clt', 'contract', 'internship', 'temporary');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('unspecified', 'internship', 'junior', 'mid', 'senior', 'lead');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('remote', 'hybrid', 'onsite');--> statement-breakpoint
CREATE TABLE "professional_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"headline" varchar(140) NOT NULL,
	"location" varchar(120) DEFAULT '' NOT NULL,
	"summary" varchar(3000) DEFAULT '' NOT NULL,
	"experience_level" "experience_level" DEFAULT 'unspecified' NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"desired_roles" text[] DEFAULT '{}' NOT NULL,
	"preferred_locations" text[] DEFAULT '{}' NOT NULL,
	"work_modes" "work_mode"[] DEFAULT '{}' NOT NULL,
	"employment_types" "employment_type"[] DEFAULT '{}' NOT NULL,
	"minimum_salary_cents" integer,
	"linkedin_url" varchar(500) DEFAULT '' NOT NULL,
	"github_url" varchar(500) DEFAULT '' NOT NULL,
	"portfolio_url" varchar(500) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profile_name_not_blank" CHECK (length(trim("professional_profiles"."full_name")) > 0),
	CONSTRAINT "profile_headline_not_blank" CHECK (length(trim("professional_profiles"."headline")) > 0),
	CONSTRAINT "profile_salary_nonnegative" CHECK ("professional_profiles"."minimum_salary_cents" >= 0),
	CONSTRAINT "profile_skills_limit" CHECK (cardinality("professional_profiles"."skills") <= 30),
	CONSTRAINT "profile_roles_limit" CHECK (cardinality("professional_profiles"."desired_roles") <= 10),
	CONSTRAINT "profile_locations_limit" CHECK (cardinality("professional_profiles"."preferred_locations") <= 10)
);
--> statement-breakpoint
ALTER TABLE "professional_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "professional_profiles" ADD CONSTRAINT "professional_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;