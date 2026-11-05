"use client";

import { useActionState, useId, useState } from "react";
import { signIn } from "@/modules/auth/actions";
import { AuthSubmit } from "./auth-submit";
import { Icon } from "./ui/icon";

export function LoginForm({
  next,
  available,
}: {
  next: string;
  available: boolean;
}) {
  const [state, action] = useActionState(signIn, {});
  const [showPassword, setShowPassword] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  return (
    <form
      action={action}
      className="login-form"
      aria-describedby={state.error ? errorId : undefined}
    >
      <input type="hidden" name="next" value={next} />
      <div className="login-field">
        <label htmlFor={emailId}>E-mail</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          required
          placeholder="voce@exemplo.com"
          disabled={!available}
        />
      </div>
      <div className="login-field">
        <label htmlFor={passwordId}>Senha</label>
        <div className="password-field">
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            maxLength={1024}
            required
            placeholder="Sua senha"
            disabled={!available}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            disabled={!available}
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon name="eye" width="18" height="18" />
          </button>
        </div>
      </div>
      {state.error && (
        <p className="auth-error" role="alert" id={errorId}>
          {state.error}
        </p>
      )}
      {!available && (
        <p className="auth-error" role="alert">
          O acesso está temporariamente indisponível. Tente novamente mais
          tarde.
        </p>
      )}
      <AuthSubmit pendingText="Entrando..." disabled={!available}>
        Entrar no Jobin
        <Icon name="arrow" width="16" height="16" />
      </AuthSubmit>
    </form>
  );
}
