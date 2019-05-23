package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.OrderShopDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity OrderShop and its DTO OrderShopDTO.
 */
@Mapper(componentModel = "spring", uses = {ShippingMapper.class, ShopMapper.class, MyOrderMapper.class})
public interface OrderShopMapper extends EntityMapper<OrderShopDTO, OrderShop> {

    @Mapping(source = "shipping.id", target = "shippingId")
    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "order.id", target = "orderId")
    OrderShopDTO toDto(OrderShop orderShop);

    @Mapping(source = "shippingId", target = "shipping")
    @Mapping(source = "shopId", target = "shop")
    @Mapping(target = "items", ignore = true)
    @Mapping(source = "orderId", target = "order")
    OrderShop toEntity(OrderShopDTO orderShopDTO);

    default OrderShop fromId(Long id) {
        if (id == null) {
            return null;
        }
        OrderShop orderShop = new OrderShop();
        orderShop.setId(id);
        return orderShop;
    }
}
