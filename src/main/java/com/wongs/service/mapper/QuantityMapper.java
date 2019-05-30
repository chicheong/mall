package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Quantity;
import com.wongs.service.dto.QuantityDTO;

/**
 * Mapper for the entity Quantity and its DTO QuantityDTO.
 */
@Service
public class QuantityMapper {

	public QuantityDTO toDto(Quantity quantity) {
		if (quantity == null) return null;
		return new QuantityDTO(quantity);
	}

    public Set<QuantityDTO> toDto(Set<Quantity> quantities) {
        return quantities.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<QuantityDTO> toDto(List<Quantity> quantities) {
        return quantities.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Quantity toEntity(QuantityDTO quantityDTO) {
        if (quantityDTO == null) {
            return null;
        } else {
        	Quantity quantity = new Quantity();
        	quantity.setId(quantityDTO.getId());
        	quantity.setFrom(quantityDTO.getFrom());
        	quantity.setTo(quantityDTO.getTo());
        	quantity.setQuantity(quantityDTO.getQuantity());
    		quantity.setItem(quantityDTO.getItem());
        	
            return quantity;
        }
    }

    public Set<Quantity> toEntity(Set<QuantityDTO> quantityDTOs) {
        return quantityDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<Quantity> toEntity(List<QuantityDTO> quantityDTOs) {
        return quantityDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public Quantity fromId(Long id) {
        if (id == null) {
            return null;
        }
        Quantity quantity = new Quantity();
        quantity.setId(id);
        return quantity;
    }
}
