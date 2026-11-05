import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { verifiedIdentity } from "./service";
import { accounts } from "./accounts";

// Cache restrito à renderização atual; nunca compartilha identidade entre requisições.
export const currentIdentity = cache(async () => {
  const client = await createSupabaseServerClient();
  return verifiedIdentity(client.auth);
});

export async function requireAccount() {
  const identity = await currentIdentity();
  if (!identity) redirect("/login");
  await accounts.ensureUser(identity.id);
  return identity;
}
