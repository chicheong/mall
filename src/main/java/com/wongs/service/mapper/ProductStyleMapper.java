package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.ProductStyle;
import com.wongs.service.dto.ProductStyleDTO;

/**
 * Mapper for the entity ProductStyle and its DTO ProductStyleDTO.
 */
@Service
public class ProductStyleMapper {

	public ProductStyleDTO toDto(ProductStyle productStyle) {
		if (productStyle == null) return null;
		return new ProductStyleDTO(productStyle);
	}

    public Set<ProductStyleDTO> toDto(Set<ProductStyle> productStyles) {
        return productStyles.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<ProductStyleDTO> toDto(List<ProductStyle> productStyles) {
        return productStyles.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ProductStyle toEntity(ProductStyleDTO productStyleDTO) {
        if (productStyleDTO == null) {
            return null;
        } else {
        	ProductStyle productStyle = new ProductStyle();
        	productStyle.setId(productStyleDTO.getId());
        	productStyle.setName(productStyleDTO.getName());
        	productStyle.setCode(productStyleDTO.getCode());
        	productStyle.setIsDefault(productStyleDTO.getIsDefault());
        	productStyle.setType(productStyleDTO.getType());
    		productStyle.setProduct(productStyleDTO.getProduct());
            return productStyle;
        }
    }

    public Set<ProductStyle> toEntity(Set<ProductStyleDTO> productStyleDTOs) {
        return productStyleDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<ProductStyle> toEntity(List<ProductStyleDTO> productStyleDTOs) {
        return productStyleDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public ProductStyle fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProductStyle productStyle = new ProductStyle();
        productStyle.setId(id);
        return productStyle;
    }
}
