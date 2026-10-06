import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes unitários das funções puras (utils e services)
export default defineConfig({
  resolve: {
    // Mesmo alias "@/..." do tsconfig
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
