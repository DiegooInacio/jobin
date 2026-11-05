import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import type { AccountStore } from "./service";

export const accounts: AccountStore = {
  async ensureUser(id) {
    await getDb()
      .insert(users)
      .values({ id })
      .onConflictDoNothing({ target: users.id });
  },
  async findById(id) {
    const result = await getDb()
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] ?? null;
  },
};
