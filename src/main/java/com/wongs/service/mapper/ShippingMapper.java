package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ShippingDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Shipping and its DTO ShippingDTO.
 */
@Mapper(componentModel = "spring", uses = {ShippingTypeMapper.class})
public interface ShippingMapper extends EntityMapper<ShippingDTO, Shipping> {

    @Mapping(source = "type.id", target = "typeId")
    ShippingDTO toDto(Shipping shipping);

    @Mapping(target = "statusHistories", ignore = true)
    @Mapping(source = "typeId", target = "type")
    Shipping toEntity(ShippingDTO shippingDTO);

    default Shipping fromId(Long id) {
        if (id == null) {
            return null;
        }
        Shipping shipping = new Shipping();
        shipping.setId(id);
        return shipping;
    }
}
