package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.OrderDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Order and its DTO OrderDTO.
 */
@Mapper(componentModel = "spring")
public interface OrderMapper extends EntityMapper <OrderDTO, Order> {

    OrderDTO toDto(Order order); 
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "statusHistories", ignore = true)

    @Mapping(target = "userInfo", ignore = true)
    Order toEntity(OrderDTO orderDTO); 
    default Order fromId(Long id) {
        if (id == null) {
            return null;
        }
        Order order = new Order();
        order.setId(id);
        return order;
    }
}
