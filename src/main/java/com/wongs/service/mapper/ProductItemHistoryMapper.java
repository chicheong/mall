package com.wongs.service.mapper;


import com.wongs.domain.*;
import com.wongs.service.dto.ProductItemHistoryDTO;
import com.wongs.service.dto.ProductItemHistoryDTO;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity {@link ProductItemHistory} and its DTO {@link ProductItemHistoryDTO}.
 */
@Service
public class ProductItemHistoryMapper {

	public ProductItemHistoryDTO toDto(ProductItemHistory productItemHistory) {
    	if (productItemHistory == null) return null;
		return new ProductItemHistoryDTO(productItemHistory);
	}
    
    public Set<ProductItemHistoryDTO> toDto(Set<ProductItemHistory> productItemHistoryes) {
        return productItemHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ProductItemHistoryDTO> toDto(List<ProductItemHistory> productItemHistoryes) {
        return productItemHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ProductItemHistory toEntity(ProductItemHistoryDTO productItemHistoryDTO) {
        if (productItemHistoryDTO == null) {
            return null;
        } else {
        	ProductItemHistory productItemHistory = new ProductItemHistory();
        	productItemHistory.setId(productItemHistoryDTO.getId());
        	productItemHistory.setCode(productItemHistoryDTO.getCode());
        	productItemHistory.setIsDefault(productItemHistoryDTO.isIsDefault());
        	productItemHistory.setQuantity(productItemHistoryDTO.getQuantity());
        	productItemHistory.setCurrency(productItemHistoryDTO.getCurrency());
        	productItemHistory.setPrice(productItemHistoryDTO.getPrice());
        	productItemHistory.setCreatedBy(productItemHistoryDTO.getCreatedBy());
        	productItemHistory.setCreatedDate(productItemHistoryDTO.getCreatedDate());
        	
            return productItemHistory;
        }
    }

    public List<ProductItemHistory> toEntity(List<ProductItemHistoryDTO> productItemHistoryDTOs) {
        return productItemHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<ProductItemHistory> toEntity(Set<ProductItemHistoryDTO> productItemHistoryDTOs) {
        return productItemHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public ProductItemHistory fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProductItemHistory productItemHistory = new ProductItemHistory();
        productItemHistory.setId(id);
        return productItemHistory;
    }
}
