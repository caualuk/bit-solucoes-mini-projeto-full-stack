import { API_URL } from "@/app/services/api";

// Dados enviados no login
export interface LoginRequest {
  username: string;
  password: string;
}

// Resposta do login: apenas o token JWT
export interface LoginResponse {
  token: string;
}

// Faz o login (rota pública, não usa token)
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Usuário ou senha inválidos.");
  }

  return response.json();
}
