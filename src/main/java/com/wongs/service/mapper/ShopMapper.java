package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ShopDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Shop and its DTO ShopDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ShopMapper extends EntityMapper<ShopDTO, Shop> {


    @Mapping(target = "shippingPriceRules", ignore = true)
    @Mapping(target = "accounts", ignore = true)
    Shop toEntity(ShopDTO shopDTO);

    default Shop fromId(Long id) {
        if (id == null) {
            return null;
        }
        Shop shop = new Shop();
        shop.setId(id);
        return shop;
    }
}
