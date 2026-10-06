package br.com.bitsolucoes.portal_solicitacoes.service;

import br.com.bitsolucoes.portal_solicitacoes.dto.auth.LoginRequestDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.auth.LoginResponseDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.user.CreateUserDTO;
import br.com.bitsolucoes.portal_solicitacoes.entity.User;
import br.com.bitsolucoes.portal_solicitacoes.exception.BusinessException;
import br.com.bitsolucoes.portal_solicitacoes.repository.UserRepository;
import br.com.bitsolucoes.portal_solicitacoes.security.TokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginComCredenciaisValidasRetornaToken() {
        User user = new User();
        user.setUsername("joao");
        user.setPassword("senha-criptografada");

        when(userRepository.findByUsername("joao")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "senha-criptografada")).thenReturn(true);
        when(tokenProvider.buildToken("joao")).thenReturn("token-jwt");

        LoginResponseDTO response = authService.login(new LoginRequestDTO("joao", "123456"));

        assertEquals("token-jwt", response.token());
    }

    @Test
    void loginComSenhaInvalidaLancaErro() {
        User user = new User();
        user.setUsername("joao");
        user.setPassword("senha-criptografada");

        when(userRepository.findByUsername("joao")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("errada", "senha-criptografada")).thenReturn(false);

        assertThrows(
                BusinessException.class,
                () -> authService.login(new LoginRequestDTO("joao", "errada"))
        );
    }

    @Test
    void loginComUsuarioInexistenteLancaErro() {
        when(userRepository.findByUsername("ninguem")).thenReturn(Optional.empty());

        assertThrows(
                BusinessException.class,
                () -> authService.login(new LoginRequestDTO("ninguem", "123456"))
        );
    }

    @Test
    void cadastroSalvaSenhaCriptografada() {
        when(userRepository.findByUsername("maria")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("123456")).thenReturn("hash");

        authService.register(new CreateUserDTO("maria", "123456"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        assertEquals("maria", captor.getValue().getUsername());
        assertEquals("hash", captor.getValue().getPassword());
    }

    @Test
    void impedirCadastroDeUsuarioDuplicado() {
        when(userRepository.findByUsername("maria")).thenReturn(Optional.of(new User()));

        assertThrows(
                BusinessException.class,
                () -> authService.register(new CreateUserDTO("maria", "123456"))
        );

        verify(userRepository, never()).save(any(User.class));
    }
}
