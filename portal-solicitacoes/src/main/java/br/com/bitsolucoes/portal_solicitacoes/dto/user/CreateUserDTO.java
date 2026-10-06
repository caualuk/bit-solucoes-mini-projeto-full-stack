package br.com.bitsolucoes.portal_solicitacoes.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDTO(
        @NotBlank(message = "O nome de usuário é obrigatório.")
        String username,

        @NotBlank(message = "A senha é obrigatória.")
        @Size(min = 6, message = "A senha deve conter no mínimo 6 caracteres.")
        String password
) {
}
