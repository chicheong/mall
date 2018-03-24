package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.UrlDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Url and its DTO UrlDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UrlMapper extends EntityMapper<UrlDTO, Url> {



    default Url fromId(Long id) {
        if (id == null) {
            return null;
        }
        Url url = new Url();
        url.setId(id);
        return url;
    }
}
