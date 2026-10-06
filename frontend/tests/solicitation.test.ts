import { afterEach, describe, expect, it, vi } from "vitest";

import { getSolicitations } from "@/app/services/solicitation/solicitation";

describe("getSolicitations", () => {
  afterEach(() => vi.unstubAllGlobals());

  // Substitui fetch/localStorage e devolve a URL chamada
  function mockApi() {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: [], totalElements: 0, totalPages: 0, number: 0 }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => "token", setItem: vi.fn(), removeItem: vi.fn() });
    return () => new URL(fetchMock.mock.calls[0][0]);
  }

  it("usa paginação e ordenação padrão", async () => {
    const calledUrl = mockApi();

    await getSolicitations();

    const url = calledUrl();
    expect(url.pathname).toBe("/v1/requests");
    expect(url.searchParams.get("page")).toBe("0");
    expect(url.searchParams.get("size")).toBe("10");
    expect(url.searchParams.get("sort")).toBe("createdAt,desc");
  });

  it("envia filtros e converte datas para início e fim do dia", async () => {
    const calledUrl = mockApi();

    await getSolicitations({
      title: "notebook",
      category: "IT",
      status: "OPEN",
      startDate: "2026-10-01",
      endDate: "2026-10-05",
    });

    const params = calledUrl().searchParams;
    expect(params.get("title")).toBe("notebook");
    expect(params.get("category")).toBe("IT");
    expect(params.get("status")).toBe("OPEN");
    expect(params.get("startDate")).toBe("2026-10-01T00:00:00");
    expect(params.get("endDate")).toBe("2026-10-05T23:59:59");
  });

  it("não envia filtros vazios", async () => {
    const calledUrl = mockApi();

    await getSolicitations({ title: "", category: "", status: "" });

    const params = calledUrl().searchParams;
    expect(params.has("title")).toBe(false);
    expect(params.has("category")).toBe(false);
    expect(params.has("status")).toBe(false);
  });
});
