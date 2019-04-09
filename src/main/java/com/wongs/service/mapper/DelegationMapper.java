package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.DelegationDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Delegation and its DTO DelegationDTO.
 */
@Mapper(componentModel = "spring", uses = {MyAccountMapper.class})
public interface DelegationMapper extends EntityMapper<DelegationDTO, Delegation> {

    @Mapping(source = "account.id", target = "accountId")
    DelegationDTO toDto(Delegation delegation);

    @Mapping(source = "accountId", target = "account")
    Delegation toEntity(DelegationDTO delegationDTO);

    default Delegation fromId(Long id) {
        if (id == null) {
            return null;
        }
        Delegation delegation = new Delegation();
        delegation.setId(id);
        return delegation;
    }
}
