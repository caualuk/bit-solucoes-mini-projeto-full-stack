package br.com.bitsolucoes.portal_solicitacoes.repository.specification;

import br.com.bitsolucoes.portal_solicitacoes.entity.Solicitation;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationCategory;
import br.com.bitsolucoes.portal_solicitacoes.enums.SolicitationStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class SolicitationSpecification {

    // Busca a solicitação pelo título
    public static Specification<Solicitation> titleContains(String title) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + title.toLowerCase() + "%"
                );
    }

    // Filtra as solicitações por categoria
    public static Specification<Solicitation> hasCategory(SolicitationCategory category) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category"), category);
    }

    // Filtra as solicitações por status
    public static Specification<Solicitation> hasStatus(SolicitationStatus status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    // Data inicial da busca
    public static Specification<Solicitation> createdAfter(LocalDateTime startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(
                        root.get("createdAt"),
                        startDate
                );
    }

    // Data final da busca
    public static Specification<Solicitation> createdBefore(LocalDateTime endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(
                        root.get("createdAt"),
                        endDate
                );
    }
}
