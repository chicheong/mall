package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.ProductHistory;
import com.wongs.service.dto.ProductHistoryDTO;

/**
 * Mapper for the entity {@link ProductHistory} and its DTO {@link ProductHistoryDTO}.
 */
@Service
public class ProductHistoryMapper {

	public ProductHistoryDTO toDto(ProductHistory productHistory) {
    	if (productHistory == null) return null;
		return new ProductHistoryDTO(productHistory);
	}
    
    public Set<ProductHistoryDTO> toDto(Set<ProductHistory> productHistoryes) {
        return productHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ProductHistoryDTO> toDto(List<ProductHistory> productHistoryes) {
        return productHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ProductHistory toEntity(ProductHistoryDTO productHistoryDTO) {
        if (productHistoryDTO == null) {
            return null;
        } else {
        	ProductHistory productHistory = new ProductHistory();
        	productHistory.setId(productHistoryDTO.getId());
        	productHistory.setProductId(productHistoryDTO.getProductId());
        	productHistory.setName(productHistoryDTO.getName());
        	productHistory.setCode(productHistoryDTO.getCode());
        	productHistory.setBrand(productHistoryDTO.getBrand());
        	productHistory.setDescription(productHistoryDTO.getDescription());
        	productHistory.setContent(productHistoryDTO.getContent());
        	productHistory.setRemark(productHistoryDTO.getRemark());
        	productHistory.setStatus(productHistoryDTO.getStatus());
        	productHistory.setCreatedBy(productHistoryDTO.getCreatedBy());
        	productHistory.setCreatedDate(productHistoryDTO.getCreatedDate());
        	
            return productHistory;
        }
    }

    public List<ProductHistory> toEntity(List<ProductHistoryDTO> productHistoryDTOs) {
        return productHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<ProductHistory> toEntity(Set<ProductHistoryDTO> productHistoryDTOs) {
        return productHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public ProductHistory fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProductHistory productHistory = new ProductHistory();
        productHistory.setId(id);
        return productHistory;
    }
}
