export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error(
      "Configure as variáveis do Supabase no ambiente do servidor.",
    );
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("URL do Supabase inválida.");
  }
  const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (
    (parsed.protocol !== "https:" &&
      !(isLocal && parsed.protocol === "http:")) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/"
  )
    throw new Error("URL do Supabase inválida.");
  if (!key.startsWith("sb_publishable_"))
    throw new Error(
      "Use a chave publicável do Supabase, nunca a chave secreta.",
    );
  return { url, key };
}
