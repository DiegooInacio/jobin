import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseUrl } from "./environment";
import * as schema from "./schema";

const databaseGlobal = globalThis as typeof globalThis & { jobinPool?: Pool };

// Conexão criada apenas quando houver uma operação de banco, nunca no build.
export function getDb() {
  databaseGlobal.jobinPool ??= new Pool({
    connectionString: getDatabaseUrl(),
    max: 5,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
  });

  return drizzle({ client: databaseGlobal.jobinPool, schema });
}
