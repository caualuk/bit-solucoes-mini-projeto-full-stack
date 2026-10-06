// Completa com zero à esquerda (ex.: 5 -> "05")
const pad = (n: number) => String(n).padStart(2, "0");

// Data curta: 05/10/2026
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Data com hora: 05/10/2026 às 13:20
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)} às ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Código curto exibido na tela, a partir do UUID
export function shortCode(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

// Data de hoje por extenso: "segunda-feira, 5 de outubro"
export function todayLabel(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
