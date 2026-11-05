import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireAccount } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const identity = await requireAccount();
  return <AppShell email={identity.email}>{children}</AppShell>;
}
