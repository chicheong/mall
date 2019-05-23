package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.QuantityDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Quantity and its DTO QuantityDTO.
 */
@Mapper(componentModel = "spring", uses = {ProductItemMapper.class})
public interface QuantityMapper extends EntityMapper<QuantityDTO, Quantity> {

    @Mapping(source = "item.id", target = "itemId")
    QuantityDTO toDto(Quantity quantity);

    @Mapping(source = "itemId", target = "item")
    Quantity toEntity(QuantityDTO quantityDTO);

    default Quantity fromId(Long id) {
        if (id == null) {
            return null;
        }
        Quantity quantity = new Quantity();
        quantity.setId(id);
        return quantity;
    }
}
