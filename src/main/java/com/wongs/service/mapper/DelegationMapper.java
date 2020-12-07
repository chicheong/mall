package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Delegation;
import com.wongs.domain.MyAccount;
import com.wongs.service.dto.DelegationDTO;

/**
 * Mapper for the entity {@link Delegation} and its DTO {@link DelegationDTO}.
 */
@Service
public class DelegationMapper {

	public DelegationDTO toDto(Delegation delegation) {
    	if (delegation == null) return null;
		return new DelegationDTO(delegation);
	}
    
    public Set<DelegationDTO> toDto(Set<Delegation> delegations) {
        return delegations.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<DelegationDTO> toDto(List<Delegation> delegations) {
        return delegations.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Delegation toEntity(DelegationDTO delegationDTO) {
        if (delegationDTO == null) {
            return null;
        } else {
        	Delegation delegation = new Delegation();
        	delegation.setId(delegationDTO.getId());
        	delegation.setFrom(delegationDTO.getFrom());
        	delegation.setTo(delegationDTO.getTo());
        	delegation.setType(delegationDTO.getType());
        	delegation.setDelegateId(delegationDTO.getDelegateId());
        	delegation.setStatus(delegationDTO.getStatus());
        	delegation.setCreatedBy(delegationDTO.getCreatedBy());
        	delegation.setCreatedDate(delegationDTO.getCreatedDate());
        	delegation.setLastModifiedBy(delegationDTO.getLastModifiedBy());
        	delegation.setLastModifiedDate(delegationDTO.getLastModifiedDate());
        	delegation.setAccount(this.myAccountFromId(delegationDTO.getAccountId()));
        	
            return delegation;
        }
    }

    public List<Delegation> toEntity(List<DelegationDTO> delegationDTOs) {
        return delegationDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Delegation> toEntity(Set<DelegationDTO> delegationDTOs) {
        return delegationDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Delegation fromId(Long id) {
        if (id == null) {
            return null;
        }
        Delegation delegation = new Delegation();
        delegation.setId(id);
        return delegation;
    }
    
    public MyAccount myAccountFromId(Long id) {
    	MyAccount myAccount = new MyAccount();
    	myAccount.setId(id);
    	return myAccount;
    }
}
