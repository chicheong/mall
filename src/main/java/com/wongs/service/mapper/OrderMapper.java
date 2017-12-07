package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.OrderDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Order and its DTO OrderDTO.
 */
@Mapper(componentModel = "spring", uses = {UserInfoMapper.class})
public interface OrderMapper extends EntityMapper<OrderDTO, Order> {

    @Mapping(source = "userInfo.id", target = "userInfoId")
    OrderDTO toDto(Order order); 

    @Mapping(target = "items", ignore = true)
    @Mapping(target = "statusHistories", ignore = true)
    @Mapping(source = "userInfoId", target = "userInfo")
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
