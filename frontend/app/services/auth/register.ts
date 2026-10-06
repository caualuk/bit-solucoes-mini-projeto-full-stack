import { API_URL } from "@/app/services/api";

// Dados enviados no cadastro
export interface RegisterRequest {
  username: string;
  password: string;
}

// Cria a conta (rota pública, não usa token)
export async function register(data: RegisterRequest): Promise<void> {
  const response = await fetch(`${API_URL}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Repassa a mensagem do backend 
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Não foi possível registrar o usuário.");
  }
}
