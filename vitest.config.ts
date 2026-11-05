import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "vitest/config";

// O mesmo carregador de .env usado pela aplicação, sem depender do Next em execução.
loadEnvConfig(process.cwd(), false);

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 10_000,
    hookTimeout: 30_000,
  },
});
