package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ProductStyleDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity ProductStyle and its DTO ProductStyleDTO.
 */
@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface ProductStyleMapper extends EntityMapper<ProductStyleDTO, ProductStyle> {

    @Mapping(source = "product.id", target = "productId")
    ProductStyleDTO toDto(ProductStyle productStyle);

    @Mapping(source = "productId", target = "product")
    ProductStyle toEntity(ProductStyleDTO productStyleDTO);

    default ProductStyle fromId(Long id) {
        if (id == null) {
            return null;
        }
        ProductStyle productStyle = new ProductStyle();
        productStyle.setId(id);
        return productStyle;
    }
}
