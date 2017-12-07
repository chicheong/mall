package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ProductDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Product and its DTO ProductDTO.
 */
@Mapper(componentModel = "spring", uses = {UserInfoMapper.class, })
public interface ProductMapper extends EntityMapper <ProductDTO, Product> {

    @Mapping(source = "userInfo.id", target = "userInfoId")
    ProductDTO toDto(Product product); 
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "histories", ignore = true)

    @Mapping(source = "userInfoId", target = "userInfo")
    @Mapping(target = "categories", ignore = true)
    Product toEntity(ProductDTO productDTO); 
    default Product fromId(Long id) {
        if (id == null) {
            return null;
        }
        Product product = new Product();
        product.setId(id);
        return product;
    }
}
