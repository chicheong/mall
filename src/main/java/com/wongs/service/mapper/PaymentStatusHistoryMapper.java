package com.wongs.service.mapper;


import com.wongs.domain.*;
import com.wongs.service.dto.PaymentStatusHistoryDTO;
import com.wongs.service.dto.PaymentStatusHistoryDTO;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity {@link PaymentStatusHistory} and its DTO {@link PaymentStatusHistoryDTO}.
 */
@Service
public class PaymentStatusHistoryMapper {

	public PaymentStatusHistoryDTO toDto(PaymentStatusHistory paymentStatusHistory) {
    	if (paymentStatusHistory == null) return null;
		return new PaymentStatusHistoryDTO(paymentStatusHistory);
	}
    
    public Set<PaymentStatusHistoryDTO> toDto(Set<PaymentStatusHistory> paymentStatusHistoryes) {
        return paymentStatusHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<PaymentStatusHistoryDTO> toDto(List<PaymentStatusHistory> paymentStatusHistoryes) {
        return paymentStatusHistoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public PaymentStatusHistory toEntity(PaymentStatusHistoryDTO paymentStatusHistoryDTO) {
        if (paymentStatusHistoryDTO == null) {
            return null;
        } else {
        	PaymentStatusHistory paymentStatusHistory = new PaymentStatusHistory();
        	paymentStatusHistory.setId(paymentStatusHistoryDTO.getId());
        	paymentStatusHistory.setEffectiveDate(paymentStatusHistoryDTO.getEffectiveDate());
        	paymentStatusHistory.setStatus(paymentStatusHistoryDTO.getStatus());
        	paymentStatusHistory.setPayment(paymentStatusHistoryDTO.getPayment());
        	
            return paymentStatusHistory;
        }
    }

    public List<PaymentStatusHistory> toEntity(List<PaymentStatusHistoryDTO> paymentStatusHistoryDTOs) {
        return paymentStatusHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<PaymentStatusHistory> toEntity(Set<PaymentStatusHistoryDTO> paymentStatusHistoryDTOs) {
        return paymentStatusHistoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public PaymentStatusHistory fromId(Long id) {
        if (id == null) {
            return null;
        }
        PaymentStatusHistory paymentStatusHistory = new PaymentStatusHistory();
        paymentStatusHistory.setId(id);
        return paymentStatusHistory;
    }
}
