package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.AddressDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Address and its DTO AddressDTO.
 */
@Mapper(componentModel = "spring", uses = {CountryMapper.class, StateMapper.class})
public interface AddressMapper extends EntityMapper<AddressDTO, Address> {

    @Mapping(source = "country.id", target = "countryId")
    @Mapping(source = "state.id", target = "stateId")
    AddressDTO toDto(Address address);

    @Mapping(source = "countryId", target = "country")
    @Mapping(source = "stateId", target = "state")
    Address toEntity(AddressDTO addressDTO);

    default Address fromId(Long id) {
        if (id == null) {
            return null;
        }
        Address address = new Address();
        address.setId(id);
        return address;
    }
}
