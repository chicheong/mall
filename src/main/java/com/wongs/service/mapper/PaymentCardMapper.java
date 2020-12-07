package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.PaymentCard;
import com.wongs.service.dto.PaymentCardDTO;

/**
 * Mapper for the entity {@link PaymentPaymentCard} and its DTO {@link PaymentPaymentCardDTO}.
 */
@Service
public class PaymentCardMapper {

	public PaymentCardDTO toDto(PaymentCard paymentCard) {
    	if (paymentCard == null) return null;
		return new PaymentCardDTO(paymentCard);
	}
    
    public Set<PaymentCardDTO> toDto(Set<PaymentCard> paymentCardes) {
        return paymentCardes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<PaymentCardDTO> toDto(List<PaymentCard> paymentCardes) {
        return paymentCardes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public PaymentCard toEntity(PaymentCardDTO paymentCardDTO) {
        if (paymentCardDTO == null) {
            return null;
        } else {
        	PaymentCard paymentCard = new PaymentCard();
        	paymentCard.setId(paymentCardDTO.getId());
        	paymentCard.setHolderName(paymentCardDTO.getHolderName());
        	paymentCard.setCardNumber(paymentCardDTO.getCardNumber());
        	paymentCard.setExpirationMonth(paymentCardDTO.getExpirationMonth());
        	paymentCard.setExpirationYear(paymentCardDTO.getExpirationYear());
        	paymentCard.setCvc(paymentCardDTO.getCvc());
//        	paymentCard.setPayment(paymentCardDTO.getPayment());
        	
            return paymentCard;
        }
    }

    public List<PaymentCard> toEntity(List<PaymentCardDTO> paymentCardDTOs) {
        return paymentCardDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<PaymentCard> toEntity(Set<PaymentCardDTO> paymentCardDTOs) {
        return paymentCardDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public PaymentCard fromId(Long id) {
        if (id == null) {
            return null;
        }
        PaymentCard paymentCard = new PaymentCard();
        paymentCard.setId(id);
        return paymentCard;
    }
}
