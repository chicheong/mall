package com.wongs.service.mapper;


import com.wongs.domain.*;
import com.wongs.service.dto.ShippingStatusHistoryDTO;
import com.wongs.service.dto.ShippingStatusHistoryDTO;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity {@link ShippingStatusHistory} and its DTO {@link ShippingStatusHistoryDTO}.
 */
@Service
public class ShippingStatusHistoryMapper {

	public ShippingStatusHistoryDTO toDto(ShippingStatusHistory shippingStatusHistory) {
    	if (shippingStatusHistory == null) return null;
		return new ShippingStatusHistoryDTO(shippingStatusHistory);
	}
    
    public Set<ShippingStatusHistoryDTO> toDto(Set<ShippingStatusHistory> shippingStatusHistoryes) {
        return shippingStatusHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ShippingStatusHistoryDTO> toDto(List<ShippingStatusHistory> shippingStatusHistoryes) {
        return shippingStatusHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ShippingStatusHistory toEntity(ShippingStatusHistoryDTO shippingStatusHistoryDTO) {
        if (shippingStatusHistoryDTO == null) {
            return null;
        } else {
        	ShippingStatusHistory shippingStatusHistory = new ShippingStatusHistory();
        	shippingStatusHistory.setId(shippingStatusHistoryDTO.getId());
        	shippingStatusHistory.setEffectiveDate(shippingStatusHistoryDTO.getEffectiveDate());
        	shippingStatusHistory.setStatus(shippingStatusHistoryDTO.getStatus());
        	shippingStatusHistory.setShipping(shippingStatusHistoryDTO.getShipping());
        	
            return shippingStatusHistory;
        }
    }

    public List<ShippingStatusHistory> toEntity(List<ShippingStatusHistoryDTO> shippingStatusHistoryDTOs) {
        return shippingStatusHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<ShippingStatusHistory> toEntity(Set<ShippingStatusHistoryDTO> shippingStatusHistoryDTOs) {
        return shippingStatusHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public ShippingStatusHistory fromId(Long id) {
        if (id == null) {
            return null;
        }
        ShippingStatusHistory shippingStatusHistory = new ShippingStatusHistory();
        shippingStatusHistory.setId(id);
        return shippingStatusHistory;
    }
}
