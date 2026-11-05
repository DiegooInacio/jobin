"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import { Icon } from "@/components/ui/icon";

const navigation = [
  { href: "/", label: "Candidaturas" },
  { href: "/vagas", label: "Vagas para você" },
  { href: "/perfil", label: "Meu perfil" },
  { href: "/curriculos", label: "Currículos" },
];

export function AppShell({
  children,
  email,
}: {
  children: ReactNode;
  email?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="app-header">
        <Link href="/" className="brand" aria-label="Jobin — início">
          <span className="brand-symbol">
            <Icon name="briefcase" width="16" height="16" />
          </span>
          Jobin
        </Link>
        <nav className="main-nav" aria-label="Navegação principal">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname === href ? " active" : ""}`}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="workspace-label">
          <span className="workspace-email" title={email}>
            {email ?? "Meu espaço"}
          </span>
          <span className="workspace-avatar" aria-label="Conta conectada">
            {email?.charAt(0).toUpperCase() ?? "J"}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
