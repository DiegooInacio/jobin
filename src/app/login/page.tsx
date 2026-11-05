import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { SignOutButton } from "@/components/sign-out-button";
import { Icon } from "@/components/ui/icon";
import { safeReturnPath } from "@/modules/auth/credentials";
import { getSupabaseConfig } from "@/integrations/supabase/config";

export const metadata: Metadata = { title: "Entrar | Jobin" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>;
}) {
  const query = await searchParams;
  let available = true;
  try {
    getSupabaseConfig();
  } catch {
    available = false;
  }
  return (
    <main id="conteudo" className="auth-page">
      <section className="auth-intro" aria-label="Jobin">
        <div className="brand">
          <span className="brand-symbol">
            <Icon name="briefcase" width="17" height="17" />
          </span>
          Jobin
        </div>
        <div className="auth-intro-content">
          <p className="eyebrow">SEU ESPAÇO DE CARREIRA</p>
          <h2>
            Mais clareza para
            <br />
            seu próximo passo.
          </h2>
          <p>
            Organize oportunidades, acompanhe suas candidaturas e escreva o
            próximo capítulo da sua carreira.
          </p>
          <div className="auth-illustration" aria-hidden="true">
            {["Salvas", "Enviadas", "Entrevistas"].map((stage, index) => (
              <div key={stage}>
                <span>{stage}</span>
                {Array.from({ length: 3 - index }, (_, card) => (
                  <div className="auth-mini-card" key={card}>
                    <i />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="auth-intro-footer">Uma oportunidade de cada vez.</p>
      </section>
      <section className="auth-content" aria-labelledby="login-title">
        <div className="auth-card">
          <span className="auth-lock">
            <Icon name="user" width="22" height="22" />
          </span>
          <h1 id="login-title">Entre no seu espaço</h1>
          <p className="auth-description">
            Sua jornada profissional, em um só lugar.
          </p>
          {query.erro === "saida" && (
            <div className="auth-error" role="alert">
              <p>Não foi possível encerrar sua sessão. Tente sair novamente.</p>
              <SignOutButton />
            </div>
          )}
          <LoginForm next={safeReturnPath(query.next)} available={available} />
          <p className="auth-footnote">
            Seu espaço é pessoal. Entre com o e-mail cadastrado na sua conta.
          </p>
        </div>
      </section>
    </main>
  );
}
