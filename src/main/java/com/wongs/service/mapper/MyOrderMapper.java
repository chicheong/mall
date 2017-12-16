package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.MyOrderDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity MyOrder and its DTO MyOrderDTO.
 */
@Mapper(componentModel = "spring", uses = {MyAccountMapper.class})
public interface MyOrderMapper extends EntityMapper<MyOrderDTO, MyOrder> {

    @Mapping(source = "account.id", target = "accountId")
    MyOrderDTO toDto(MyOrder myOrder); 

    @Mapping(target = "items", ignore = true)
    @Mapping(target = "statusHistories", ignore = true)
    @Mapping(source = "accountId", target = "account")
    MyOrder toEntity(MyOrderDTO myOrderDTO);

    default MyOrder fromId(Long id) {
        if (id == null) {
            return null;
        }
        MyOrder myOrder = new MyOrder();
        myOrder.setId(id);
        return myOrder;
    }
}
