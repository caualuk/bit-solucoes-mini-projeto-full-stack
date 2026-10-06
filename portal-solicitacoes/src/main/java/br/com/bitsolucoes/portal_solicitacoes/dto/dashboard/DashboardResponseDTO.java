package br.com.bitsolucoes.portal_solicitacoes.dto.dashboard;

public record DashboardResponseDTO(
        long  totalRequests,
        long openRequests,
        long requestsInProgress,
        long completedRequests
) {
}
