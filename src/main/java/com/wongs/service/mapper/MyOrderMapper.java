package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.MyOrderDTO;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity MyOrder and its DTO MyOrderDTO.
 */
@Service
public class MyOrderMapper {

	public MyOrderDTO myOrderToMyOrderDTO(MyOrder myOrder) {
		return new MyOrderDTO(myOrder);
	}

    public List<MyOrderDTO> myOrdersToMyOrderDTOs(List<MyOrder> myOrders) {
        return myOrders.stream()
            .filter(Objects::nonNull)
            .map(this::myOrderToMyOrderDTO)
            .collect(Collectors.toList());
    }

    public MyOrder myOrderDTOToMyOrder(MyOrderDTO myOrderDTO) {
        if (myOrderDTO == null) {
            return null;
        } else {
        	MyOrder myOrder = new MyOrder();
        	myOrder.setId(myOrderDTO.getId());
        	myOrder.setTotal(myOrderDTO.getTotal());
        	myOrder.setCurrency(myOrderDTO.getCurrency());
        	myOrder.setRemark(myOrderDTO.getRemark());
        	myOrder.setStatus(myOrderDTO.getStatus());
        	
        	myOrder.setItems(myOrderDTO.getItems());
        	myOrder.setStatusHistories(myOrderDTO.getStatusHistories());
        	myOrder.setAccount(this.myAccountFromId(myOrderDTO.getAccountId()));
        	
            return myOrder;
        }
    }

    public List<MyOrder> myOrderDTOsToMyOrders(List<MyOrderDTO> myOrderDTOs) {
        return myOrderDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::myOrderDTOToMyOrder)
            .collect(Collectors.toList());
    }

    public MyOrder myOrderFromId(Long id) {
        if (id == null) {
            return null;
        }
        MyOrder myOrder = new MyOrder();
        myOrder.setId(id);
        return myOrder;
    }
    
    public MyAccount myAccountFromId(Long id) {
    	MyAccount myAccount = new MyAccount();
    	myAccount.setId(id);
    	return myAccount;
    }
}
