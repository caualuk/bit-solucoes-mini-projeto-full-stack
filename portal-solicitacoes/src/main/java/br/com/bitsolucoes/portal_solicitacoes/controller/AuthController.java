package br.com.bitsolucoes.portal_solicitacoes.controller;

import br.com.bitsolucoes.portal_solicitacoes.dto.auth.LoginRequestDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.auth.LoginResponseDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.user.CreateUserDTO;
import br.com.bitsolucoes.portal_solicitacoes.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody @Valid LoginRequestDTO dto
    ) {
        return ResponseEntity.ok(
                authService.login(dto)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid CreateUserDTO dto) {
        authService.register(dto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
