package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ShippingDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Shipping and its DTO ShippingDTO.
 */
@Mapper(componentModel = "spring", uses = {MyOrderMapper.class, AddressMapper.class, ShippingTypeMapper.class})
public interface ShippingMapper extends EntityMapper<ShippingDTO, Shipping> {

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "shippingAddress.id", target = "shippingAddressId")
    @Mapping(source = "billingAddress.id", target = "billingAddressId")
    @Mapping(source = "type.id", target = "typeId")
    ShippingDTO toDto(Shipping shipping);

    @Mapping(source = "orderId", target = "order")
    @Mapping(source = "shippingAddressId", target = "shippingAddress")
    @Mapping(source = "billingAddressId", target = "billingAddress")
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
