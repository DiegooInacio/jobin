"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import {
  parseCredentials,
  safeReturnPath,
  type LoginState,
} from "./credentials";
import { accounts } from "./accounts";
import { signInAccount } from "./service";

export async function signIn(
  _previous: LoginState,
  form: FormData,
): Promise<LoginState> {
  const credentials = parseCredentials(form);
  if (!credentials) return { error: "Informe um e-mail válido e sua senha." };
  let result: LoginState;
  try {
    const client = await createSupabaseServerClient();
    result = await signInAccount(client.auth, accounts, credentials);
  } catch {
    return {
      error:
        "O acesso está indisponível no momento. Tente novamente mais tarde.",
    };
  }
  if (result.error) return result;
  revalidatePath("/", "layout");
  redirect(safeReturnPath(form.get("next")));
}

export async function signOut() {
  let failed = false;
  try {
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.signOut({ scope: "local" });
    failed = Boolean(error);
  } catch {
    failed = true;
  }
  if (failed) redirect("/login?erro=saida");
  revalidatePath("/", "layout");
  redirect("/login");
}
