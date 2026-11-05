import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

// O UUID é fornecido pelo Supabase Auth; o backend sincroniza a identidade validada.
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}).enableRLS();
