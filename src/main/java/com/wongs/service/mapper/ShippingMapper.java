package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ShippingDTO;
import com.wongs.service.dto.ShippingDTO;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity Shipping and its DTO ShippingDTO.
 */
@Service
public class ShippingMapper {

	public ShippingDTO toDto(Shipping shipping) {
		if (shipping == null) return null;
		return new ShippingDTO(shipping);
	}

    public Set<ShippingDTO> toDto(Set<Shipping> shippings) {
        return shippings.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }
    
    public List<ShippingDTO> toDto(List<Shipping> prices) {
        return prices.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Shipping toEntity(ShippingDTO shippingDTO) {
        if (shippingDTO == null) {
            return null;
        } else {
        	Shipping shipping = new Shipping();
        	shipping.setId(shippingDTO.getId());
        	shipping.setPrice(shippingDTO.getPrice());
        	shipping.setCurrency(shippingDTO.getCurrency());
        	shipping.setDate(shippingDTO.getDate());
    		shipping.setStatus(shippingDTO.getStatus());
//    		shipping.setOrderShop(shippingDTO.getOrderShop());
    		shipping.setType(shippingDTO.getType());
    		shipping.setStatusHistories(shippingDTO.getStatusHistories());
    		
            return shipping;
        }
    }

    public Set<Shipping> toEntity(Set<ShippingDTO> shippingDTOs) {
        return shippingDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());	
    }
    
    public List<Shipping> toEntity(List<ShippingDTO> shippingDTOs) {
        return shippingDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());	
    }

    public Shipping fromId(Long id) {
        if (id == null) {
            return null;
        }
        Shipping shipping = new Shipping();
        shipping.setId(id);
        return shipping;
    }
}
