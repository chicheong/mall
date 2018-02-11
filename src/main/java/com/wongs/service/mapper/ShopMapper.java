package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Shop;
import com.wongs.service.dto.ShopDTO;

/**
 * Mapper for the entity Shop and its DTO ShopDTO.
 */
@Service
public class ShopMapper {
    
    public ShopDTO toDto(Shop shop) {
		return new ShopDTO(shop);
	}
    
    public Set<ShopDTO> toDto(Set<Shop> shops) {
        return shops.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ShopDTO> toDto(List<Shop> shops) {
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

    public List<Shop> toEntity(List<ShopDTO> shopDTOs) {
        return shopDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Shop> toEntity(Set<ShopDTO> shopDTOs) {
        return shopDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Shop fromId(Long id) {
        if (id == null) {
            return null;
        }
        Shop shop = new Shop();
        shop.setId(id);
        return shop;
    }
}
