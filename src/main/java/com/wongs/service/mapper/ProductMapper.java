package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.ShopService;
import com.wongs.service.dto.ProductDTO;

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
	
	public ProductDTO productToProductDTO(Product product) {
		return new ProductDTO(product);
	}

    public Set<ProductDTO> productsToProductDTOs(Set<Product> products) {
        return products.stream()
            .filter(Objects::nonNull)
            .map(this::productToProductDTO)
            .collect(Collectors.toSet());
    }

    public Product productDTOToProduct(ProductDTO productDTO) {
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
        	
        	product.setItems(productDTO.getItems());
        	product.setHistories(productDTO.getHistories());
        	product.setCategories(productDTO.getCategories());
        	
        	Shop shop = new Shop();
        	shop.setId(productDTO.getShopId());
        	product.setShop(shop);
        	
            return product;
        }
    }

    public Set<Product> productDTOsToProducts(Set<ProductDTO> productDTOs) {
        return productDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::productDTOToProduct)
            .collect(Collectors.toSet());
    }

    public Product productFromId(Long id) {
        if (id == null) {
            return null;
        }
        Product product = new Product();
        product.setId(id);
        return product;
    }
	
}
