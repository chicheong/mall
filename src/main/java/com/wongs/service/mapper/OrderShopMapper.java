package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.OrderShop;
import com.wongs.service.dto.OrderShopDTO;

/**
 * Mapper for the entity OrderShop and its DTO OrderShopDTO.
 */
@Service
public class OrderShopMapper {

	public OrderShopDTO toDto(OrderShop orderShop) {
		if (orderShop == null) return null;
		return new OrderShopDTO(orderShop);
	}

    public Set<OrderShopDTO> toDto(Set<OrderShop> orderShops) {
        return orderShops.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<OrderShopDTO> toDto(List<OrderShop> orderShops) {
        return orderShops.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public OrderShop toEntity(OrderShopDTO orderShopDTO) {
        if (orderShopDTO == null) {
            return null;
        } else {
        	OrderShop orderShop = new OrderShop();
        	orderShop.setId(orderShopDTO.getId());
        	orderShop.setTotal(orderShopDTO.getTotal());
        	orderShop.setCurrency(orderShopDTO.getCurrency());
        	orderShop.setRemark(orderShopDTO.getRemark());
        	
        	orderShop.setShipping(orderShopDTO.getShipping());
        	orderShop.setShop(orderShopDTO.getShop());
//        	orderShop.setItems(orderShopDTO.getItems());
        	orderShop.setOrder(orderShopDTO.getOrder());
            return orderShop;
        }
    }

    public Set<OrderShop> toEntity(Set<OrderShopDTO> orderShopDTOs) {
        return orderShopDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<OrderShop> toEntity(List<OrderShopDTO> orderShopDTOs) {
        return orderShopDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public OrderShop fromId(Long id) {
        if (id == null) {
            return null;
        }
        OrderShop orderShop = new OrderShop();
        orderShop.setId(id);
        return orderShop;
    }
}
