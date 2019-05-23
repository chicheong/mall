package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ProductItemDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity ProductItem and its DTO ProductItemDTO.
 */
@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface ProductItemMapper extends EntityMapper<ProductItemDTO, ProductItem> {

    @Mapping(source = "product.id", target = "productId")
    ProductItemDTO toDto(ProductItem productItem);

    @Mapping(target = "color", ignore = true)
    @Mapping(target = "size", ignore = true)
    @Mapping(target = "prices", ignore = true)
    @Mapping(target = "quantities", ignore = true)
    @Mapping(source = "productId", target = "product")
    ProductItem toEntity(ProductItemDTO productItemDTO);

    default ProductItem fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProductItem productItem = new ProductItem();
        productItem.setId(id);
        return productItem;
    }
}
