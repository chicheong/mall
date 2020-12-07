package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Url;
import com.wongs.service.dto.UrlDTO;

/**
 * Mapper for the entity {@link Url} and its DTO {@link UrlDTO}.
 */
@Service
public class UrlMapper {

	public UrlDTO toDto(Url url) {
    	if (url == null) return null;
		return new UrlDTO(url);
	}
    
    public Set<UrlDTO> toDto(Set<Url> urls) {
        return urls.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<UrlDTO> toDto(List<Url> urls) {
        return urls.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Url toEntity(UrlDTO urlDTO) {
        if (urlDTO == null) {
            return null;
        } else {
        	Url url = new Url();
        	url.setId(urlDTO.getId());
        	url.setEntityType(urlDTO.getEntityType());
        	url.setEntityId(urlDTO.getEntityId());
        	url.setPath(urlDTO.getPath());
        	url.setFileName(urlDTO.getFileName());
        	url.setSequence(urlDTO.getSequence());
        	url.setDescription(urlDTO.getDescription());
        	url.setCreatedBy(urlDTO.getCreatedBy());
        	url.setCreatedDate(urlDTO.getCreatedDate());
        	url.setLastModifiedBy(urlDTO.getLastModifiedBy());
        	url.setLastModifiedDate(urlDTO.getLastModifiedDate());
        	
            return url;
        }
    }

    public List<Url> toEntity(List<UrlDTO> urlDTOs) {
        return urlDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Url> toEntity(Set<UrlDTO> urlDTOs) {
        return urlDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Url fromId(Long id) {
        if (id == null) {
            return null;
        }
        Url url = new Url();
        url.setId(id);
        return url;
    }
}
