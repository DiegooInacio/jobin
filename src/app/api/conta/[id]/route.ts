import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { accounts } from "@/modules/auth/accounts";
import { ownedAccount } from "@/modules/auth/service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const client = await createSupabaseServerClient();
    const result = await ownedAccount(client.auth, accounts, (await params).id);
    if (result.status !== 200)
      return NextResponse.json(
        {
          error:
            result.status === 401
              ? "Não autenticado."
              : "Conta não encontrada.",
        },
        { status: result.status, headers },
      );
    return NextResponse.json(result.account, { headers });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível consultar a conta." },
      { status: 503, headers },
    );
  }
}
