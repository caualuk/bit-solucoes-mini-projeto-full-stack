package br.com.bitsolucoes.portal_solicitacoes.controller;

import br.com.bitsolucoes.portal_solicitacoes.dto.dashboard.DashboardResponseDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.CreateSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.RequestSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.UpdateSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationCategory;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationStatus;
import br.com.bitsolucoes.portal_solicitacoes.service.SolicitationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.web.PageableDefault;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/requests")
@AllArgsConstructor
public class SolicitationController {
    private final SolicitationService solicitationService;

    // POST
    // Cria a solicitação
    @PostMapping
    public ResponseEntity<RequestSolicitationDTO> create(
            @RequestBody @Valid CreateSolicitationDTO dto
    ) {
        return ResponseEntity.ok(solicitationService.create(dto));
    }

    // GET
    // Busca as solicitações
    @GetMapping
    public ResponseEntity<Page<RequestSolicitationDTO>> findAll(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) SolicitationCategory category,
            @RequestParam(required = false) SolicitationStatus status,
            @RequestParam(required = false) String title,
            @PageableDefault(
                    size = 10,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ) {
        return ResponseEntity.ok(
                solicitationService.findWithFilters(
                        startDate, endDate, category, status, title, pageable
                )
        );
    }

    // Busca as solicitações por ID
    @GetMapping("/{id}")
    public ResponseEntity<RequestSolicitationDTO> findById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(solicitationService.findById(id));
    }

    // Busca o Dashboard
    @GetMapping("/dashboard")
    ResponseEntity<DashboardResponseDTO> getDashboard() {
        return ResponseEntity.ok(solicitationService.getDashboard());
    }

    // DELETE

    // Deleta a solicitação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        solicitationService.delete(id);

        return ResponseEntity.noContent().build();
    }

    // UPDATE

    // Atualiza a solicitação
    @PutMapping("/{id}")
    public ResponseEntity<RequestSolicitationDTO> update(
            @PathVariable UUID id,
            @RequestBody @Valid UpdateSolicitationDTO dto
    ) {
        return ResponseEntity.ok(
                solicitationService.update(id, dto)
        );
    }

    // Atualiza o status da solicitação
    @PatchMapping("/{id}/status")
    public ResponseEntity<RequestSolicitationDTO> updateStatus(
            @PathVariable UUID id,
            @RequestParam SolicitationStatus status
    ) {
        return ResponseEntity.ok(
                solicitationService.updateStatus(id, status)
        );
    }



}
