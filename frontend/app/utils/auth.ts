// Chave usada para guardar o token no navegador
const TOKEN_KEY = "token";

// Retorna o token salvo (ou null se não houver)
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Salva o token após o login
export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove o token (logout)
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Lê o nome de usuário do próprio JWT (campo "sub")
export function getUsername(): string {
  const token = getToken();
  if (!token) return "";

  try {
    // O payload é a segunda parte do token, em base64url
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");

    // atob devolve bytes; o TextDecoder converte para UTF-8 (acentos como "ã")
    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)).sub ?? "";
  } catch {
    return "";
  }
}
