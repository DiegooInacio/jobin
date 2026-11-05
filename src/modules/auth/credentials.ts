export type LoginState = { error?: string };
export type Credentials = { email: string; password: string };

const privateRoutes = new Set(["/", "/vagas", "/perfil", "/curriculos"]);

export function safeReturnPath(value: unknown) {
  return typeof value === "string" && privateRoutes.has(value) ? value : "/";
}

export function parseCredentials(form: FormData): Credentials | null {
  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || typeof password !== "string") return null;
  const normalizedEmail = email.trim();
  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    !password.length ||
    password.length > 1024
  )
    return null;
  return { email: normalizedEmail, password };
}
