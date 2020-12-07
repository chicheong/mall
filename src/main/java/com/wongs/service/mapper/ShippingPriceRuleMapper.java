package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.ShippingPriceRule;
import com.wongs.service.dto.ShippingPriceRuleDTO;

/**
 * Mapper for the entity {@link ShippingPriceRule} and its DTO {@link ShippingPriceRuleDTO}.
 */
@Service
public class ShippingPriceRuleMapper {

	public ShippingPriceRuleDTO toDto(ShippingPriceRule shippingPriceRule) {
    	if (shippingPriceRule == null) return null;
		return new ShippingPriceRuleDTO(shippingPriceRule);
	}
    
    public Set<ShippingPriceRuleDTO> toDto(Set<ShippingPriceRule> shippingPriceRulees) {
        return shippingPriceRulees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ShippingPriceRuleDTO> toDto(List<ShippingPriceRule> shippingPriceRulees) {
        return shippingPriceRulees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public ShippingPriceRule toEntity(ShippingPriceRuleDTO shippingPriceRuleDTO) {
        if (shippingPriceRuleDTO == null) {
            return null;
        } else {
        	ShippingPriceRule shippingPriceRule = new ShippingPriceRule();
        	shippingPriceRule.setId(shippingPriceRuleDTO.getId());
        	shippingPriceRule.setType(shippingPriceRuleDTO.getType());
        	shippingPriceRule.setValue(shippingPriceRuleDTO.getValue());
        	shippingPriceRule.setPrice(shippingPriceRuleDTO.getPrice());
        	shippingPriceRule.setSequence(shippingPriceRuleDTO.getSequence());
        	shippingPriceRule.setShop(shippingPriceRuleDTO.getShop());
        	
            return shippingPriceRule;
        }
    }

    public List<ShippingPriceRule> toEntity(List<ShippingPriceRuleDTO> shippingPriceRuleDTOs) {
        return shippingPriceRuleDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<ShippingPriceRule> toEntity(Set<ShippingPriceRuleDTO> shippingPriceRuleDTOs) {
        return shippingPriceRuleDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public ShippingPriceRule fromId(Long id) {
        if (id == null) {
            return null;
        }
        ShippingPriceRule shippingPriceRule = new ShippingPriceRule();
        shippingPriceRule.setId(id);
        return shippingPriceRule;
    }
}
