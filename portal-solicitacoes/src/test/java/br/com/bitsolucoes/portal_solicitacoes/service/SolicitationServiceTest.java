package br.com.bitsolucoes.portal_solicitacoes.service;

import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.CreateSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.UpdateSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.entity.Solicitation;
import br.com.bitsolucoes.portal_solicitacoes.entity.User;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationCategory;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationStatus;
import br.com.bitsolucoes.portal_solicitacoes.exception.BusinessException;
import br.com.bitsolucoes.portal_solicitacoes.exception.ResourceNotFoundException;
import br.com.bitsolucoes.portal_solicitacoes.mapper.SolicitationMapper;
import br.com.bitsolucoes.portal_solicitacoes.repository.SolicitationRepository;
import br.com.bitsolucoes.portal_solicitacoes.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SolicitationServiceTest {

    @Mock
    private SolicitationRepository solicitationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SolicitationMapper solicitationMapper;

    @InjectMocks
    private SolicitationService solicitationService;

    @Test
    void impedirEdicaoDeSolicitacaoNaoAberta() {
        Solicitation solicitation = new Solicitation();
        solicitation.setStatus(SolicitationStatus.COMPLETED);

        when(solicitationRepository.findById(any(UUID.class)))
                .thenReturn(Optional.of(solicitation));

        assertThrows(
                BusinessException.class,
                () -> solicitationService.update(
                        UUID.randomUUID(),
                        new UpdateSolicitationDTO(
                                "Novo título",
                                "Nova descrição",
                                SolicitationCategory.IT
                        )
                )
        );
    }

    @Test
    void editarSolicitacaoAberta() {
        Solicitation solicitation = new Solicitation();
        solicitation.setStatus(SolicitationStatus.OPEN);

        when(solicitationRepository.findById(any(UUID.class)))
                .thenReturn(Optional.of(solicitation));

        UpdateSolicitationDTO dto = new UpdateSolicitationDTO(
                "Novo título",
                "Nova descrição",
                SolicitationCategory.IT
        );

        UUID id = UUID.randomUUID();

        solicitationService.update(id, dto);

        verify(solicitationMapper).updateEntity(dto, solicitation);
    }

    @Test
    void impedirExclusaoDeSolicitacaoNaoAberta() {
        Solicitation solicitation = new Solicitation();
        solicitation.setStatus(SolicitationStatus.COMPLETED);

        when(solicitationRepository.findById(any(UUID.class)))
                .thenReturn(Optional.of(solicitation));

        assertThrows(
                BusinessException.class,
                () -> solicitationService.delete(UUID.randomUUID())
        );
    }

    @Test
    void excluirSolicitacaoAberta() {
        Solicitation solicitation = new Solicitation();
        solicitation.setStatus(SolicitationStatus.OPEN);

        when(solicitationRepository.findById(any(UUID.class)))
                .thenReturn(Optional.of(solicitation));

        UUID id = UUID.randomUUID();

        solicitationService.delete(id);

        verify(solicitationRepository).delete(solicitation);


    }

    @Test
    void criarSolicitacaoComStatusAbertoEUsuarioAutenticado() {
        User user = new User();
        user.setUsername("joao");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("joao", null, List.of())
        );

        CreateSolicitationDTO dto = new CreateSolicitationDTO(
                "Novo notebook",
                "Notebook para o novo colaborador",
                SolicitationCategory.IT
        );

        when(solicitationMapper.toEntity(dto)).thenReturn(new Solicitation());
        when(userRepository.findByUsername("joao")).thenReturn(Optional.of(user));
        when(solicitationRepository.save(any(Solicitation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        try {
            solicitationService.create(dto);
        } finally {
            SecurityContextHolder.clearContext();
        }

        ArgumentCaptor<Solicitation> captor = ArgumentCaptor.forClass(Solicitation.class);
        verify(solicitationRepository).save(captor.capture());

        Solicitation saved = captor.getValue();
        assertEquals(SolicitationStatus.OPEN, saved.getStatus());
        assertEquals(user, saved.getUser());
        assertNotNull(saved.getCreatedAt());
    }

    @Test
    void alterarStatusDeSolicitacao() {
        Solicitation solicitation = new Solicitation();
        solicitation.setStatus(SolicitationStatus.OPEN);

        when(solicitationRepository.findById(any(UUID.class)))
                .thenReturn(Optional.of(solicitation));

        solicitationService.updateStatus(UUID.randomUUID(), SolicitationStatus.IN_PROGRESS);

        assertEquals(SolicitationStatus.IN_PROGRESS, solicitation.getStatus());
        verify(solicitationRepository).save(solicitation);
    }

    @Test
    void lancarErroQuandoSolicitacaoNaoExiste() {
        when(solicitationRepository.findById(any(UUID.class)))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> solicitationService.findById(UUID.randomUUID())
        );
    }

    @Test
    void impedirFiltroComDataInicialPosteriorAFinal() {
        LocalDateTime now = LocalDateTime.now();

        assertThrows(
                BusinessException.class,
                () -> solicitationService.findWithFilters(
                        now, now.minusDays(1), null, null, null, Pageable.unpaged()
                )
        );
    }
}