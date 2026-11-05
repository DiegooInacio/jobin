import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

// O UUID será o identificador fornecido pelo Supabase Auth na entrega 5.
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}).enableRLS();
