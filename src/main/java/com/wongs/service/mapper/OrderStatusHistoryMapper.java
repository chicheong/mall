package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.OrderStatusHistory;
import com.wongs.service.dto.OrderStatusHistoryDTO;

/**
 * Mapper for the entity {@link OrderStatusHistory} and its DTO {@link OrderStatusHistoryDTO}.
 */
@Service
public class OrderStatusHistoryMapper {

	public OrderStatusHistoryDTO toDto(OrderStatusHistory orderStatusHistory) {
    	if (orderStatusHistory == null) return null;
		return new OrderStatusHistoryDTO(orderStatusHistory);
	}
    
    public Set<OrderStatusHistoryDTO> toDto(Set<OrderStatusHistory> orderStatusHistoryes) {
        return orderStatusHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<OrderStatusHistoryDTO> toDto(List<OrderStatusHistory> orderStatusHistoryes) {
        return orderStatusHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public OrderStatusHistory toEntity(OrderStatusHistoryDTO orderStatusHistoryDTO) {
        if (orderStatusHistoryDTO == null) {
            return null;
        } else {
        	OrderStatusHistory orderStatusHistory = new OrderStatusHistory();
        	orderStatusHistory.setId(orderStatusHistoryDTO.getId());
        	orderStatusHistory.setEffectiveDate(orderStatusHistoryDTO.getEffectiveDate());
        	orderStatusHistory.setStatus(orderStatusHistoryDTO.getStatus());
        	orderStatusHistory.setOrder(orderStatusHistoryDTO.getOrder());
        	
            return orderStatusHistory;
        }
    }

    public List<OrderStatusHistory> toEntity(List<OrderStatusHistoryDTO> orderStatusHistoryDTOs) {
        return orderStatusHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<OrderStatusHistory> toEntity(Set<OrderStatusHistoryDTO> orderStatusHistoryDTOs) {
        return orderStatusHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public OrderStatusHistory fromId(Long id) {
        if (id == null) {
            return null;
        }
        OrderStatusHistory orderStatusHistory = new OrderStatusHistory();
        orderStatusHistory.setId(id);
        return orderStatusHistory;
    }
}
