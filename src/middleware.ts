import type { NextRequest } from "next/server";
import { updateSession } from "./integrations/supabase/middleware";

export function middleware(request: NextRequest) {
  return updateSession(request);
}
export const config = {
  runtime: "nodejs",
  matcher: [
    "/",
    "/login",
    "/vagas/:path*",
    "/perfil/:path*",
    "/curriculos/:path*",
    "/api/conta/:path*",
  ],
};
