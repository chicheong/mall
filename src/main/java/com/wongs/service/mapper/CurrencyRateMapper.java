package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.CurrencyRate;
import com.wongs.service.dto.CurrencyRateDTO;

/**
 * Mapper for the entity {@link CurrencyRate} and its DTO {@link CurrencyRateDTO}.
 */
@Service
public class CurrencyRateMapper {

	public CurrencyRateDTO toDto(CurrencyRate currencyRate) {
    	if (currencyRate == null) return null;
		return new CurrencyRateDTO(currencyRate);
	}
    
    public Set<CurrencyRateDTO> toDto(Set<CurrencyRate> currencyRatees) {
        return currencyRatees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<CurrencyRateDTO> toDto(List<CurrencyRate> currencyRatees) {
        return currencyRatees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public CurrencyRate toEntity(CurrencyRateDTO currencyRateDTO) {
        if (currencyRateDTO == null) {
            return null;
        } else {
        	CurrencyRate currencyRate = new CurrencyRate();
        	currencyRate.setId(currencyRateDTO.getId());
        	currencyRate.setFrom(currencyRateDTO.getFrom());
        	currencyRate.setTo(currencyRateDTO.getTo());
        	currencyRate.setRate(currencyRateDTO.getRate());
        	currencyRate.setSourceCurrency(currencyRateDTO.getSourceCurrency());
        	currencyRate.setTargetCurrency(currencyRateDTO.getTargetCurrency());
        	
            return currencyRate;
        }
    }

    public List<CurrencyRate> toEntity(List<CurrencyRateDTO> currencyRateDTOs) {
        return currencyRateDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<CurrencyRate> toEntity(Set<CurrencyRateDTO> currencyRateDTOs) {
        return currencyRateDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public CurrencyRate fromId(Long id) {
        if (id == null) {
            return null;
        }
        CurrencyRate currencyRate = new CurrencyRate();
        currencyRate.setId(id);
        return currencyRate;
    }
}
