package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.MyAccount;
import com.wongs.service.dto.MyAccountDTO;

/**
 * Mapper for the entity MyAccount and its DTO MyAccountDTO.
 */
@Service
public class MyAccountMapper {

	public MyAccountDTO toDto(MyAccount myAccount) {
		if (myAccount == null) return null;
		return new MyAccountDTO(myAccount);
	}

    public Set<MyAccountDTO> toDto(Set<MyAccount> myAccounts) {
        return myAccounts.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<MyAccountDTO> toDto(List<MyAccount> myAccounts) {
        return myAccounts.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public MyAccount toEntity(MyAccountDTO myAccountDTO) {
        if (myAccountDTO == null) {
            return null;
        } else {
        	MyAccount myAccount = new MyAccount();
        	myAccount.setId(myAccountDTO.getId());
        	myAccount.setType(myAccountDTO.getType());
        	
            return myAccount;
        }
    }

    public Set<MyAccount> toEntity(Set<MyAccountDTO> myAccountDTOs) {
        return myAccountDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<MyAccount> toEntity(List<MyAccountDTO> myAccountDTOs) {
        return myAccountDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public MyAccount fromId(Long id) {
        if (id == null) {
            return null;
        }
        MyAccount myAccount = new MyAccount();
        myAccount.setId(id);
        return myAccount;
    }
}
