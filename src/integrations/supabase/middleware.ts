import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";
import { verifiedIdentity } from "@/modules/auth/service";
import { safeReturnPath } from "@/modules/auth/credentials";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const login = request.nextUrl.pathname === "/login";
  let identity = null;
  try {
    const { url, key } = getSupabaseConfig();
    const client = createServerClient(url, key, {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    identity = await verifiedIdentity(client.auth);
  } catch {
    /* Falha de configuração ou provedor nunca libera páginas privadas. */
  }

  const isApi = request.nextUrl.pathname.startsWith("/api/");
  if (!identity && isApi) {
    const denied = NextResponse.json(
      { error: "Não autenticado." },
      { status: 401 },
    );
    response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
    denied.headers.set("Cache-Control", "private, no-store");
    return denied;
  }
  if (
    (!identity && !login) ||
    (identity && login && !request.nextUrl.searchParams.has("erro"))
  ) {
    const target = request.nextUrl.clone();
    target.search = "";
    target.pathname = identity
      ? safeReturnPath(request.nextUrl.searchParams.get("next"))
      : "/login";
    if (!identity)
      target.searchParams.set("next", safeReturnPath(request.nextUrl.pathname));
    const redirected = NextResponse.redirect(target);
    response.cookies
      .getAll()
      .forEach((cookie) => redirected.cookies.set(cookie));
    response = redirected;
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
