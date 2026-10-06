// Valores aceitos pelo backend (enums do Java)
export type Category =
  | "IT"
  | "HR"
  | "PROCUREMENT"
  | "FINANCE"
  | "INFRASTRUCTURE";
export type Status = "OPEN" | "IN_PROGRESS" | "COMPLETED";

// Rótulos em português para as categorias
export const CATEGORY_LABELS: Record<Category, string> = {
  IT: "TI",
  HR: "RH",
  PROCUREMENT: "Compras",
  FINANCE: "Financeiro",
  INFRASTRUCTURE: "Infraestrutura",
};

// Rótulos em português para os status
export const STATUS_LABELS: Record<Status, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Atendimento",
  COMPLETED: "Concluído",
};

// Listas para montar selects e botões
export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
export const STATUSES = Object.keys(STATUS_LABELS) as Status[];
