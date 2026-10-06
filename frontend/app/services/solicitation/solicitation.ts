import { apiFetch } from "@/app/services/api";
import type { Category, Status } from "@/app/utils/constants";

// Solicitação como vem do backend
export interface Solicitation {
  id: string;
  title: string;
  description: string;
  category: Category;
  requester: string;
  createdAt: string;
  status: Status;
}

// Dados enviados para criar/editar
export interface SolicitationInput {
  title: string;
  description: string;
  category: Category;
}

// Filtros aceitos pela listagem
export interface SolicitationFilters {
  title?: string;
  category?: Category | "";
  status?: Status | "";
  startDate?: string; // formato yyyy-mm-dd
  endDate?: string; // formato yyyy-mm-dd
  page?: number;
  size?: number;
  sort?: "asc" | "desc";
}

// Resposta paginada do Spring (apenas os campos usados)
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// Lista as solicitações com filtros e paginação
export function getSolicitations(
  filters: SolicitationFilters = {},
): Promise<Page<Solicitation>> {
  const params = new URLSearchParams();

  if (filters.title) params.set("title", filters.title);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  // O backend espera LocalDateTime: início e fim do dia
  if (filters.startDate)
    params.set("startDate", `${filters.startDate}T00:00:00`);
  if (filters.endDate) params.set("endDate", `${filters.endDate}T23:59:59`);

  params.set("page", String(filters.page ?? 0));
  params.set("size", String(filters.size ?? 10));
  params.set("sort", `createdAt,${filters.sort ?? "desc"}`);

  return apiFetch(`/v1/requests?${params.toString()}`);
}

// Cria uma nova solicitação
export function createSolicitation(
  data: SolicitationInput,
): Promise<Solicitation> {
  return apiFetch("/v1/requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Edita uma solicitação (somente status Aberto)
export function updateSolicitation(
  id: string,
  data: SolicitationInput,
): Promise<Solicitation> {
  return apiFetch(`/v1/requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Altera o status de uma solicitação
export function updateSolicitationStatus(
  id: string,
  status: Status,
): Promise<Solicitation> {
  return apiFetch(`/v1/requests/${id}/status?status=${status}`, {
    method: "PATCH",
  });
}

// Exclui uma solicitação (somente status Aberto)
export function deleteSolicitation(id: string): Promise<void> {
  return apiFetch(`/v1/requests/${id}`, { method: "DELETE" });
}
