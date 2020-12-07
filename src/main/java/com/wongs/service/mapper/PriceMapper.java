package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Price;
import com.wongs.service.dto.PriceDTO;

/**
 * Mapper for the entity {@link Price} and its DTO {@link PriceDTO}.
 */
@Service
public class PriceMapper {

	public PriceDTO toDto(Price price) {
		if (price == null) return null;
		return new PriceDTO(price);
	}

    public Set<PriceDTO> toDto(Set<Price> prices) {
        return prices.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<PriceDTO> toDto(List<Price> prices) {
        return prices.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Price toEntity(PriceDTO priceDTO) {
        if (priceDTO == null) {
            return null;
        } else {
        	Price price = new Price();
        	price.setId(priceDTO.getId());
        	price.setFrom(priceDTO.getFrom());
        	price.setTo(priceDTO.getTo());
        	price.setPrice(priceDTO.getPrice());
        	price.setCurrency(priceDTO.getCurrency());
    		price.setItem(priceDTO.getItem());
        	
            return price;
        }
    }

    public Set<Price> toEntity(Set<PriceDTO> priceDTOs) {
        return priceDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<Price> toEntity(List<PriceDTO> priceDTOs) {
        return priceDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public Price fromId(Long id) {
        if (id == null) {
            return null;
        }
        Price price = new Price();
        price.setId(id);
        return price;
    }
}
