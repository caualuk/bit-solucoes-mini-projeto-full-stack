package br.com.bitsolucoes.portal_solicitacoes.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank(message = "Nome de usuário é obrigatório")
        String username,

        @NotBlank(message = "Senha é obrigatória")
        String password
) {
}
