package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.OrderItem;
import com.wongs.service.dto.OrderItemDTO;

/**
 * Mapper for the entity OrderItem and its DTO OrderItemDTO.
 */
@Service
public class OrderItemMapper {

	public OrderItemDTO toDto(OrderItem orderItem) {
		if (orderItem == null) return null;
		return new OrderItemDTO(orderItem);
	}

    public Set<OrderItemDTO> toDto(Set<OrderItem> orderItems) {
        return orderItems.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<OrderItemDTO> toDto(List<OrderItem> orderItems) {
        return orderItems.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public OrderItem toEntity(OrderItemDTO orderItemDTO) {
        if (orderItemDTO == null) {
            return null;
        } else {
        	OrderItem orderItem = new OrderItem();
        	orderItem.setId(orderItemDTO.getId());
        	orderItem.setQuantity(orderItemDTO.getQuantity());
        	orderItem.setPrice(orderItemDTO.getPrice());
        	orderItem.setCurrency(orderItemDTO.getCurrency());
        	
//        	orderItem.setProductItem(orderItemDTO.getProductItem());
        	orderItem.setShop(orderItemDTO.getShop());
            return orderItem;
        }
    }

    public Set<OrderItem> toEntity(Set<OrderItemDTO> orderItemDTOs) {
        return orderItemDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<OrderItem> toEntity(List<OrderItemDTO> orderItemDTOs) {
        return orderItemDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public OrderItem fromId(Long id) {
        if (id == null) {
            return null;
        }
        OrderItem orderItem = new OrderItem();
        orderItem.setId(id);
        return orderItem;
    }
}
