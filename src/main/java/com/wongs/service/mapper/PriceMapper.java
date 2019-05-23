package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.PriceDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Price and its DTO PriceDTO.
 */
@Mapper(componentModel = "spring", uses = {ProductItemMapper.class})
public interface PriceMapper extends EntityMapper<PriceDTO, Price> {

    @Mapping(source = "item.id", target = "itemId")
    PriceDTO toDto(Price price);

    @Mapping(source = "itemId", target = "item")
    Price toEntity(PriceDTO priceDTO);

    default Price fromId(Long id) {
        if (id == null) {
            return null;
        }
        Price price = new Price();
        price.setId(id);
        return price;
    }
}
