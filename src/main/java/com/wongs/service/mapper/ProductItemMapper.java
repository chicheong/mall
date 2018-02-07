package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.ProductItem;
import com.wongs.service.dto.ProductItemDTO;

/**
 * Mapper for the entity ProductItem and its DTO ProductItemDTO.
 */
@Service
public class ProductItemMapper {

	public ProductItemDTO toDto(ProductItem productItem) {
		return new ProductItemDTO(productItem);
	}

    public Set<ProductItemDTO> toDto(Set<ProductItem> productItems) {
        return productItems.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<ProductItemDTO> toDto(List<ProductItem> productItems) {
        return productItems.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ProductItem toEntity(ProductItemDTO productItemDTO) {
        if (productItemDTO == null) {
            return null;
        } else {
        	ProductItem productItem = new ProductItem();
        	productItem.setId(productItemDTO.getId());
        	productItem.setCode(productItemDTO.getCode());
        	productItem.setIsDefault(productItemDTO.isIsDefault());
        	productItem.setQuantity(productItemDTO.getQuantity());
        	productItem.setCurrency(productItemDTO.getCurrency());
        	productItem.setPrice(productItemDTO.getPrice());
//        	productItem.setColor(productItemDTO.getColor());
//        	productItem.setSize(productItemDTO.getSize());
    		productItem.setProduct(productItemDTO.getProduct());
            return productItem;
        }
    }

    public Set<ProductItem> toEntity(Set<ProductItemDTO> productItemDTOs) {
        return productItemDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<ProductItem> toEntity(List<ProductItemDTO> productItemDTOs) {
        return productItemDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public ProductItem fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProductItem productItem = new ProductItem();
        productItem.setId(id);
        return productItem;
    }
}
