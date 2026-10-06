package br.com.bitsolucoes.portal_solicitacoes.dto.solicitation;

import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSolicitationDTO(
        @NotBlank(message = "O título é obrigatório")
        String title,

        @NotBlank(message = "A descrição é obrigatória")
        String description,

        @NotNull(message = "A categoria é obrigatória")
        SolicitationCategory category
) {
}
