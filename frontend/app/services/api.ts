import { clearToken, getToken } from "@/app/utils/auth";

// URL base da API (definida no .env.local; usa a porta padrão do Spring se não houver)
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// Função única para chamar a API autenticada
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  // Token inválido/expirado: volta para o login
  if (response.status === 401 || response.status === 403) {
    clearToken();
    window.location.replace("/");
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  // O backend devolve a mensagem de erro como texto puro
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Ocorreu um erro inesperado.");
  }

  // Respostas sem corpo (204 No Content) retornam undefined
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
