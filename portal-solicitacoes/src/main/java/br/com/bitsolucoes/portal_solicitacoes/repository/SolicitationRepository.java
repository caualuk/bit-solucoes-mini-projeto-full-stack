package br.com.bitsolucoes.portal_solicitacoes.repository;

import br.com.bitsolucoes.portal_solicitacoes.entity.Solicitation;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface SolicitationRepository extends JpaRepository<Solicitation, UUID>, JpaSpecificationExecutor<Solicitation> {

    long countByStatus(SolicitationStatus solicitationStatus);
}
