package com.wongs.service.mapper;


import com.wongs.domain.*;
import com.wongs.service.dto.ProductStyleHistoryDTO;
import com.wongs.service.dto.ProductStyleHistoryDTO;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity {@link ProductStyleHistory} and its DTO {@link ProductStyleHistoryDTO}.
 */
@Service
public class ProductStyleHistoryMapper {

	public ProductStyleHistoryDTO toDto(ProductStyleHistory productStyleHistory) {
    	if (productStyleHistory == null) return null;
		return new ProductStyleHistoryDTO(productStyleHistory);
	}
    
    public Set<ProductStyleHistoryDTO> toDto(Set<ProductStyleHistory> productStyleHistoryes) {
        return productStyleHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ProductStyleHistoryDTO> toDto(List<ProductStyleHistory> productStyleHistoryes) {
        return productStyleHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ProductStyleHistory toEntity(ProductStyleHistoryDTO productStyleHistoryDTO) {
        if (productStyleHistoryDTO == null) {
            return null;
        } else {
        	ProductStyleHistory productStyleHistory = new ProductStyleHistory();
        	productStyleHistory.setId(productStyleHistoryDTO.getId());
        	productStyleHistory.setName(productStyleHistoryDTO.getName());
        	productStyleHistory.setCode(productStyleHistoryDTO.getCode());
        	productStyleHistory.setIsDefault(productStyleHistoryDTO.isIsDefault());
        	productStyleHistory.setType(productStyleHistoryDTO.getType());
        	productStyleHistory.setCreatedBy(productStyleHistoryDTO.getCreatedBy());
        	productStyleHistory.setCreatedDate(productStyleHistoryDTO.getCreatedDate());
        	
            return productStyleHistory;
        }
    }

    public List<ProductStyleHistory> toEntity(List<ProductStyleHistoryDTO> productStyleHistoryDTOs) {
        return productStyleHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<ProductStyleHistory> toEntity(Set<ProductStyleHistoryDTO> productStyleHistoryDTOs) {
        return productStyleHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public ProductStyleHistory fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProductStyleHistory productStyleHistory = new ProductStyleHistory();
        productStyleHistory.setId(id);
        return productStyleHistory;
    }
}
