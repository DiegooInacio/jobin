type DatabaseVariable = "DATABASE_URL" | "TEST_DATABASE_URL";

export function getDatabaseUrl(variable: DatabaseVariable = "DATABASE_URL") {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Configure ${variable} para conectar ao PostgreSQL.`);
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variable} deve conter uma URL PostgreSQL válida.`);
  }

  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !url.hostname ||
    url.pathname.length <= 1
  ) {
    throw new Error(`${variable} deve conter uma URL PostgreSQL válida.`);
  }

  if (variable === "TEST_DATABASE_URL" && url.pathname !== "/jobin_test") {
    throw new Error("Os testes exigem o banco dedicado jobin_test.");
  }

  return value;
}
