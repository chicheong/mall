package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.PaymentDTO;
import com.wongs.service.dto.PaymentDTO;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity Payment and its DTO PaymentDTO.
 */
@Service
public class PaymentMapper {

	public PaymentDTO toDto(Payment payment) {
		if (payment == null) return null;
		return new PaymentDTO(payment);
	}

    public Set<PaymentDTO> toDto(Set<Payment> payments) {
        return payments.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<PaymentDTO> toDto(List<Payment> payments) {
        return payments.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Payment toEntity(PaymentDTO paymentDTO) {
        if (paymentDTO == null) {
            return null;
        } else {
        	Payment payment = new Payment();
        	payment.setId(paymentDTO.getId());
        	payment.setAmount(paymentDTO.getAmount());
        	payment.setCurrency(paymentDTO.getCurrency());
        	payment.setType(paymentDTO.getType());
        	payment.setRemark(paymentDTO.getRemark());
    		payment.setStatus(paymentDTO.getStatus());
    		payment.setOrder(paymentDTO.getOrder());
    		payment.setStatusHistories(paymentDTO.getStatusHistories());
    		
            return payment;
        }
    }

    public Set<Payment> toEntity(Set<PaymentDTO> paymentDTOs) {
        return paymentDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<Payment> toEntity(List<PaymentDTO> paymentDTOs) {
        return paymentDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public Payment fromId(Long id) {
        if (id == null) {
            return null;
        }
        Payment payment = new Payment();
        payment.setId(id);
        return payment;
    }
}
