import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime, shortCode } from "@/app/utils/format";

describe("format", () => {
  it("formata a data no padrão dd/mm/aaaa", () => {
    expect(formatDate("2026-10-05T13:20:00")).toBe("05/10/2026");
  });

  it("formata data e hora", () => {
    expect(formatDateTime("2026-10-05T09:05:00")).toBe("05/10/2026 às 09:05");
  });

  it("gera o código curto a partir do UUID", () => {
    expect(shortCode("3f2a9c1e-1111-2222-3333-444455556666")).toBe("#3F2A9C1E");
  });
});
