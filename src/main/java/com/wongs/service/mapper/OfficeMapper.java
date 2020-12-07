package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Office;
import com.wongs.service.dto.OfficeDTO;

/**
 * Mapper for the entity {@link Office} and its DTO {@link OfficeDTO}.
 */
@Service
public class OfficeMapper {

	public OfficeDTO toDto(Office office) {
    	if (office == null) return null;
		return new OfficeDTO(office);
	}
    
    public Set<OfficeDTO> toDto(Set<Office> officees) {
        return officees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<OfficeDTO> toDto(List<Office> officees) {
        return officees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Office toEntity(OfficeDTO officeDTO) {
        if (officeDTO == null) {
            return null;
        } else {
        	Office office = new Office();
        	office.setId(officeDTO.getId());
        	office.setCode(officeDTO.getCode());
        	office.setName(officeDTO.getName());
        	office.setStatus(officeDTO.getStatus());
        	office.setAddress(officeDTO.getAddress());
//        	office.setOffices(departmentDTO.getOffices());
//        	office.setCompanyies(departmentDTO.getCompanyies());
        	
            return office;
        }
    }

    public List<Office> toEntity(List<OfficeDTO> officeDTOs) {
        return officeDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Office> toEntity(Set<OfficeDTO> officeDTOs) {
        return officeDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Office fromId(Long id) {
        if (id == null) {
            return null;
        }
        Office office = new Office();
        office.setId(id);
        return office;
    }
}