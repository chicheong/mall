package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Address;
import com.wongs.service.dto.AddressDTO;

/**
 * Mapper for the entity Address and its DTO AddressDTO.
 */
@Service
public class AddressMapper {

	public AddressDTO toDto(Address address) {
    	if (address == null) return null;
		return new AddressDTO(address);
	}
    
    public Set<AddressDTO> toDto(Set<Address> addresses) {
        return addresses.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<AddressDTO> toDto(List<Address> addresses) {
        return addresses.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Address toEntity(AddressDTO addressDTO) {
        if (addressDTO == null) {
            return null;
        } else {
        	Address address = new Address();
        	address.setId(addressDTO.getId());
        	address.setLine1(addressDTO.getLine1());
        	address.setLine2(addressDTO.getLine2());
        	address.setLine3(addressDTO.getLine3());
        	address.setLine4(addressDTO.getLine4());
        	address.setCity(addressDTO.getCity());
        	address.setPostalCode(addressDTO.getPostalCode());
        	address.setCountry(addressDTO.getCountry());
        	address.setMyState(addressDTO.getMyState());
        	
            return address;
        }
    }

    public List<Address> toEntity(List<AddressDTO> addressDTOs) {
        return addressDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Address> toEntity(Set<AddressDTO> addressDTOs) {
        return addressDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Address fromId(Long id) {
        if (id == null) {
            return null;
        }
        Address address = new Address();
        address.setId(id);
        return address;
    }
}
