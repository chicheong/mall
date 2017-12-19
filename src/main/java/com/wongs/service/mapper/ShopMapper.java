package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.ShopDTO;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity Shop and its DTO ShopDTO.
 */
@Service
public class ShopMapper {
    
    public ShopDTO toDto(Shop shop) {
		return new ShopDTO(shop);
	}

    public List<ShopDTO> toDtos(List<Shop> shops) {
        return shops.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Shop toEntity(ShopDTO shopDTO) {
        if (shopDTO == null) {
            return null;
        } else {
        	Shop shop = new Shop();
        	shop.setId(shopDTO.getId());
        	shop.setName(shopDTO.getName());
        	shop.setCode(shopDTO.getCode());
        	shop.setDescription(shopDTO.getDescription());
        	shop.setStatus(shopDTO.getStatus());
        	shop.setCreatedBy(shopDTO.getCreatedBy());
        	shop.setCreatedDate(shopDTO.getCreatedDate());
        	shop.setLastModifiedBy(shopDTO.getLastModifiedBy());
        	shop.setLastModifiedDate(shopDTO.getLastModifiedDate());
        	
            return shop;
        }
    }

    public List<Shop> toShops(List<ShopDTO> shopDTOs) {
        return shopDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    public Shop shopFromId(Long id) {
        if (id == null) {
            return null;
        }
        Shop shop = new Shop();
        shop.setId(id);
        return shop;
    }
}
