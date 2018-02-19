package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.ShopService;
import com.wongs.service.dto.ProductDTO;

import scala.collection.immutable.Stream;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity Product and its DTO ProductDTO.
 */
@Service
public class ProductMapper {
	
	public ProductDTO toDto(Product product) {
		if (product == null) return null;
		return new ProductDTO(product);
	}

    public Set<ProductDTO> toDto(Set<Product> products) {
        return products.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public Product toEntity(ProductDTO productDTO) {
        if (productDTO == null) {
            return null;
        } else {
        	Product product = new Product();
        	product.setId(productDTO.getId());
        	product.setName(productDTO.getName());
        	product.setCode(productDTO.getCode());
        	product.setBrand(productDTO.getBrand());
        	product.setDescription(productDTO.getDescription());
        	product.setContent(productDTO.getContent());
        	product.setRemark(productDTO.getRemark());
        	product.setStatus(productDTO.getStatus());
        	product.setCreatedBy(productDTO.getCreatedBy());
        	product.setCreatedDate(productDTO.getCreatedDate());
        	product.setLastModifiedBy(productDTO.getLastModifiedBy());
        	product.setLastModifiedDate(productDTO.getLastModifiedDate());
        	
//        	productDTO.getColors().addAll(productDTO.getSizes());
//        	product.setStyles(productDTO.getColors());
        	
//        	product.setItems(productDTO.getItems());
        	product.setCategories(productDTO.getCategories());
        	
        	Shop shop = new Shop();
        	shop.setId(productDTO.getShopId());
        	product.setShop(shop);
        	
            return product;
        }
    }

    public Set<Product> toEntity(Set<ProductDTO> productDTOs) {
        return productDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Product fromId(Long id) {
        if (id == null) {
            return null;
        }
        Product product = new Product();
        product.setId(id);
        return product;
    }
	
}
