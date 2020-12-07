package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.ShippingType;
import com.wongs.service.dto.ShippingTypeDTO;

/**
 * Mapper for the entity {@link ShippingType} and its DTO {@link ShippingTypeDTO}.
 */
@Service
public class ShippingTypeMapper {

	public ShippingTypeDTO toDto(ShippingType shippingType) {
    	if (shippingType == null) return null;
		return new ShippingTypeDTO(shippingType);
	}
    
    public Set<ShippingTypeDTO> toDto(Set<ShippingType> shippingTypees) {
        return shippingTypees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ShippingTypeDTO> toDto(List<ShippingType> shippingTypees) {
        return shippingTypees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ShippingType toEntity(ShippingTypeDTO shippingTypeDTO) {
        if (shippingTypeDTO == null) {
            return null;
        } else {
        	ShippingType shippingType = new ShippingType();
        	shippingType.setId(shippingTypeDTO.getId());
        	shippingType.setName(shippingTypeDTO.getName());
        	shippingType.setDescription(shippingTypeDTO.getDescription());
        	shippingType.setPrice(shippingTypeDTO.getPrice());
        	shippingType.setCurrency(shippingTypeDTO.getCurrency());
        	
            return shippingType;
        }
    }

    public List<ShippingType> toEntity(List<ShippingTypeDTO> shippingTypeDTOs) {
        return shippingTypeDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<ShippingType> toEntity(Set<ShippingTypeDTO> shippingTypeDTOs) {
        return shippingTypeDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public ShippingType fromId(Long id) {
        if (id == null) {
            return null;
        }
        ShippingType shippingType = new ShippingType();
        shippingType.setId(id);
        return shippingType;
    }
}
