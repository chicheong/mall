package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Country;
import com.wongs.service.dto.CountryDTO;

/**
 * Mapper for the entity {@link Country} and its DTO {@link CountryDTO}.
 */
@Service
public class CountryMapper {

	public CountryDTO toDto(Country country) {
    	if (country == null) return null;
		return new CountryDTO(country);
	}
    
    public Set<CountryDTO> toDto(Set<Country> countryes) {
        return countryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<CountryDTO> toDto(List<Country> countryes) {
        return countryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Country toEntity(CountryDTO countryDTO) {
        if (countryDTO == null) {
            return null;
        } else {
        	Country country = new Country();
        	country.setId(countryDTO.getId());
        	country.setCode(countryDTO.getCode());
        	country.setLabel(countryDTO.getLabel());
        	country.setNum(countryDTO.getNum());
        	country.setName(countryDTO.getName());
        	
            return country;
        }
    }

    public List<Country> toEntity(List<CountryDTO> countryDTOs) {
        return countryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Country> toEntity(Set<CountryDTO> countryDTOs) {
        return countryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Country fromId(Long id) {
        if (id == null) {
            return null;
        }
        Country country = new Country();
        country.setId(id);
        return country;
    }
}
