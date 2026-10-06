import { apiFetch } from "@/app/services/api";

// Totais exibidos nos cards do dashboard
export interface DashboardResponse {
  totalRequests: number;
  openRequests: number;
  requestsInProgress: number;
  completedRequests: number;
}

// Busca os totais por status
export function getDashboard(): Promise<DashboardResponse> {
  return apiFetch("/v1/requests/dashboard");
}
