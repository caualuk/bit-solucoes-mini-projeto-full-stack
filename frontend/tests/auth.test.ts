import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearToken, getToken, getUsername, saveToken } from "@/app/utils/auth";

// Monta um JWT falso só com o payload (a assinatura não é validada no front)
function fakeJwt(payload: object): string {
  const base64url = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `header.${base64url}.assinatura`;
}

describe("auth", () => {
  beforeEach(() => {
    // localStorage simples em memória (os testes rodam no Node)
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
    });
  });

  it("salva, lê e remove o token", () => {
    saveToken("abc");
    expect(getToken()).toBe("abc");

    clearToken();
    expect(getToken()).toBeNull();
  });

  it("extrai o nome de usuário do token, incluindo acentos", () => {
    saveToken(fakeJwt({ sub: "joão" }));
    expect(getUsername()).toBe("joão");
  });

  it("retorna vazio sem token ou com token inválido", () => {
    expect(getUsername()).toBe("");

    saveToken("token-invalido");
    expect(getUsername()).toBe("");
  });
});
