package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Card;
import com.wongs.service.dto.CardDTO;

/**
 * Mapper for the entity {@link Card} and its DTO {@link CardDTO}.
 */
@Service
public class CardMapper {

	public CardDTO toDto(Card card) {
    	if (card == null) return null;
		return new CardDTO(card);
	}
    
    public Set<CardDTO> toDto(Set<Card> cardes) {
        return cardes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<CardDTO> toDto(List<Card> cardes) {
        return cardes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Card toEntity(CardDTO cardDTO) {
        if (cardDTO == null) {
            return null;
        } else {
        	Card card = new Card();
        	card.setId(cardDTO.getId());
        	card.setHolderName(cardDTO.getHolderName());
        	card.setCardNumber(cardDTO.getCardNumber());
        	card.setExpirationMonth(cardDTO.getExpirationMonth());
        	card.setExpirationYear(cardDTO.getExpirationYear());
        	card.setCvc(cardDTO.getCvc());
        	card.setAccount(cardDTO.getAccount());
        	
            return card;
        }
    }

    public List<Card> toEntity(List<CardDTO> cardDTOs) {
        return cardDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Card> toEntity(Set<CardDTO> cardDTOs) {
        return cardDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Card fromId(Long id) {
        if (id == null) {
            return null;
        }
        Card card = new Card();
        card.setId(id);
        return card;
    }
}
