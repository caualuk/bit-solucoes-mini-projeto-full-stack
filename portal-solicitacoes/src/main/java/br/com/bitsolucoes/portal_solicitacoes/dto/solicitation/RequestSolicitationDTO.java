package br.com.bitsolucoes.portal_solicitacoes.dto.solicitation;

import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationCategory;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record RequestSolicitationDTO(
        UUID id,
        String title,
        String description,
        SolicitationCategory category,
        String requester,
        LocalDateTime createdAt,
        SolicitationStatus status
) {
}
