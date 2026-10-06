package br.com.bitsolucoes.portal_solicitacoes.mapper;

import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.CreateSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.RequestSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.dto.solicitation.UpdateSolicitationDTO;
import br.com.bitsolucoes.portal_solicitacoes.entity.Solicitation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SolicitationMapper {

    @Mapping(source = "user.username", target = "requester")
    RequestSolicitationDTO toResponse(Solicitation solicitation);

    Solicitation toEntity(CreateSolicitationDTO dto);

    void updateEntity(UpdateSolicitationDTO dto, @MappingTarget Solicitation solicitation);
}
