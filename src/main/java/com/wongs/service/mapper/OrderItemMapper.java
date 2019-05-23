package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.OrderItemDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity OrderItem and its DTO OrderItemDTO.
 */
@Mapper(componentModel = "spring", uses = {OrderShopMapper.class})
public interface OrderItemMapper extends EntityMapper<OrderItemDTO, OrderItem> {

    @Mapping(source = "shop.id", target = "shopId")
    OrderItemDTO toDto(OrderItem orderItem);

    @Mapping(target = "productItem", ignore = true)
    @Mapping(source = "shopId", target = "shop")
    OrderItem toEntity(OrderItemDTO orderItemDTO);

    default OrderItem fromId(Long id) {
        if (id == null) {
            return null;
        }
        OrderItem orderItem = new OrderItem();
        orderItem.setId(id);
        return orderItem;
    }
}
