package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.MyAccount;
import com.wongs.domain.MyOrder;
import com.wongs.service.dto.MyOrderDTO;

/**
 * Mapper for the entity {@link MyOrder} and its DTO {@link MyOrderDTO}.
 */
@Service
public class MyOrderMapper {

	public MyOrderDTO toDto(MyOrder myOrder) {
		if (myOrder == null) return null;
		return new MyOrderDTO(myOrder);
	}

    public Set<MyOrderDTO> toDto(Set<MyOrder> myOrders) {
        return myOrders.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
	
    public List<MyOrderDTO> toDto(List<MyOrder> myOrders) {
        return myOrders.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public MyOrder toEntity(MyOrderDTO myOrderDTO) {
        if (myOrderDTO == null) {
            return null;
        } else {
        	MyOrder myOrder = new MyOrder();
        	myOrder.setId(myOrderDTO.getId());
        	myOrder.setTotal(myOrderDTO.getTotal());
        	myOrder.setCurrency(myOrderDTO.getCurrency());
        	myOrder.setRemark(myOrderDTO.getRemark());
        	myOrder.setStatus(myOrderDTO.getStatus());
        	myOrder.setShipping(myOrderDTO.getShipping());
        	myOrder.setBilling(myOrderDTO.getBilling());
        	
//        	myOrder.setShops(myOrderDTO.getShops());
        	myOrder.setStatusHistories(myOrderDTO.getStatusHistories());
        	myOrder.setAccount(this.myAccountFromId(myOrderDTO.getAccountId()));
        	
            return myOrder;
        }
    }

    public Set<MyOrder> toEntity(Set<MyOrderDTO> myOrderDTOs) {
        return myOrderDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }
    
    public List<MyOrder> toEntity(List<MyOrderDTO> myOrderDTOs) {
        return myOrderDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    public MyOrder fromId(Long id) {
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
