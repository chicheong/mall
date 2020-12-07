package com.wongs.service.mapper;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import org.springframework.stereotype.Service;

import com.wongs.domain.Company;
import com.wongs.domain.enumeration.CommonStatus;
import com.wongs.service.dto.CompanyDTO;
import com.wongs.service.dto.DepartmentDTO;
import com.wongs.service.dto.OfficeDTO;

/**
 * Mapper for the entity {@link Company} and its DTO {@link CompanyDTO}.
 */
@Service
public class CompanyMapper {

	public CompanyDTO toDto(Company company) {
    	if (company == null) return null;
		return new CompanyDTO(company);
	}
    
    public Set<CompanyDTO> toDto(Set<Company> companyes) {
        return companyes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<CompanyDTO> toDto(List<Company> companyes) {
        return companyes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Company toEntity(CompanyDTO companyDTO) {
        if (companyDTO == null) {
            return null;
        } else {
        	Company company = new Company();
        	company.setId(companyDTO.getId());
        	company.setCode(companyDTO.getCode());
        	company.setName(companyDTO.getName());
        	company.setStatus(companyDTO.getStatus());
        	company.setParent(companyDTO.getParent());
//        	company.setDepartments(companyDTO.getDepartments());
//        	company.setOffices(companyDTO.getOffices());
        	
            return company;
        }
    }

    public List<Company> toEntity(List<CompanyDTO> companyDTOs) {
        return companyDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Company> toEntity(Set<CompanyDTO> companyDTOs) {
        return companyDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Company fromId(Long id) {
        if (id == null) {
            return null;
        }
        Company company = new Company();
        company.setId(id);
        return company;
    }
}
