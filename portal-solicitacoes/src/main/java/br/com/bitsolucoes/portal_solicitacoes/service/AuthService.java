package br.com.bitsolucoes.portal_solicitacoes.service;

import br.com.bitsolucoes.portal_solicitacoes.dto.auth.LoginRequestDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.auth.LoginResponseDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.user.CreateUserDTO;
import br.com.bitsolucoes.portal_solicitacoes.entity.User;
import br.com.bitsolucoes.portal_solicitacoes.exception.BusinessException;
import br.com.bitsolucoes.portal_solicitacoes.repository.UserRepository;
import br.com.bitsolucoes.portal_solicitacoes.security.TokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    public LoginResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByUsername(dto.username())
                .orElseThrow(() ->
                        new BusinessException("Usuário ou senha inválidos.")
                );

        // Validando senha criptografada
        if(!passwordEncoder.matches(dto.password(), user.getPassword())){
            throw new BusinessException("Usuário ou senha inválidos.");
        }

        String token = tokenProvider.buildToken(user.getUsername());

        return new LoginResponseDTO(token);
    }

    public void register(CreateUserDTO dto) {
        if(userRepository.findByUsername(dto.username()).isPresent()){
            throw new BusinessException("Esse nome de usuário já está cadastrado.");
        }

        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));

        userRepository.save(user);
    }

    public void logout(){
        // O cliente deverá descartar o token JWT
    }
}
