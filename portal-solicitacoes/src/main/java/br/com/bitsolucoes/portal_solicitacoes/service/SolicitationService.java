package br.com.bitsolucoes.portal_solicitacoes.service;

import br.com.bitsolucoes.portal_solicitacoes.dto.dashboard.DashboardResponseDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.CreateSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.RequestSolicitationDTO;
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
import lombok.AllArgsConstructor;
import br.com.bitsolucoes.portal_solicitacoes.repository.specification.SolicitationSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SolicitationService {

    private final SolicitationRepository solicitationRepository;
    private final UserRepository userRepository;
    private final SolicitationMapper solicitationMapper;

    public RequestSolicitationDTO create(CreateSolicitationDTO dto) {

        // REGRA:
        // Toda solicitação criada deve iniciar como OPEN

        Solicitation solicitation = solicitationMapper.toEntity(dto);

        String username = SecurityContextHolder.getContext()
                        .getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado.")
                );

        solicitation.setStatus(SolicitationStatus.OPEN);
        solicitation.setCreatedAt(LocalDateTime.now());
        solicitation.setUser(user);

        // O usuário solicitante deve vir do usuário autenticado
        // e não do DTO enviado pelo front.

        Solicitation savedSolicitation = solicitationRepository.save(solicitation);

        return solicitationMapper.toResponse(savedSolicitation);
    }

    public RequestSolicitationDTO findById(UUID id){
        Solicitation solicitation = findRequest(id);

        return solicitationMapper.toResponse(solicitation);
    }

    public RequestSolicitationDTO update(UUID id, UpdateSolicitationDTO dto){
        Solicitation solicitation = findRequest(id);

        if(solicitation.getStatus() != SolicitationStatus.OPEN){
            throw new BusinessException("Apenas solicitações abertas podem ser editadas!");
        }

        solicitationMapper.updateEntity(dto, solicitation);

        Solicitation updatedSolicitation = solicitationRepository.save(solicitation);

        return solicitationMapper.toResponse(updatedSolicitation);
    }

    public void delete(UUID id) {
        Solicitation solicitation = findRequest(id);

        if(solicitation.getStatus() != SolicitationStatus.OPEN) {
            throw new BusinessException("Apenas solicitações abertas podem ser excluídas!");
        }

        solicitationRepository.delete(solicitation);
    }

    public RequestSolicitationDTO updateStatus(UUID id, SolicitationStatus status) {
        Solicitation solicitation = findRequest(id);

        solicitation.setStatus(status);
        Solicitation updatedSolicitation = solicitationRepository.save(solicitation);

        return solicitationMapper.toResponse(updatedSolicitation);
    }

    private Solicitation findRequest(UUID id) {
        return solicitationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Solicitação não encontrada."));
    }

    public Page<RequestSolicitationDTO> findWithFilters(
            LocalDateTime startDate,
            LocalDateTime endDate,
            SolicitationCategory category,
            SolicitationStatus status,
            String title,
            Pageable pageable
    ) {

        Specification<Solicitation> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.conjunction();

        if(startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new BusinessException("A data inicial não pode ser posterior à data final.");
        }

        if (startDate != null) {
            specification = specification.and(
                    SolicitationSpecification.createdAfter(startDate)
            );
        }

        if (endDate != null) {
            specification = specification.and(
                    SolicitationSpecification.createdBefore(endDate)
            );
        }

        if (category != null) {
            specification = specification.and(
                    SolicitationSpecification.hasCategory(category)
            );
        }

        if (status != null) {
            specification = specification.and(
                    SolicitationSpecification.hasStatus(status)
            );
        }

        if (title != null && !title.isBlank()) {
            specification = specification.and(
                    SolicitationSpecification.titleContains(title)
            );
        }

        return solicitationRepository.findAll(specification, pageable)
                .map(solicitationMapper::toResponse);
    }

    public DashboardResponseDTO getDashboard() {


        long totalRequests = solicitationRepository.count();

        long openRequests = solicitationRepository.countByStatus(SolicitationStatus.OPEN);

        long requestsInProgress = solicitationRepository.countByStatus(SolicitationStatus.IN_PROGRESS);

        long completedRequests = solicitationRepository.countByStatus(SolicitationStatus.COMPLETED);

        return new DashboardResponseDTO(
                totalRequests,
                openRequests,
                requestsInProgress,
                completedRequests
        );
    }
}
