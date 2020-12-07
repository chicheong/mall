package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Department;
import com.wongs.service.dto.DepartmentDTO;

/**
 * Mapper for the entity {@link Department} and its DTO {@link DepartmentDTO}.
 */
@Service
public class DepartmentMapper {

	public DepartmentDTO toDto(Department department) {
    	if (department == null) return null;
		return new DepartmentDTO(department);
	}
    
    public Set<DepartmentDTO> toDto(Set<Department> departmentes) {
        return departmentes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<DepartmentDTO> toDto(List<Department> departmentes) {
        return departmentes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Department toEntity(DepartmentDTO departmentDTO) {
        if (departmentDTO == null) {
            return null;
        } else {
        	Department department = new Department();
        	department.setId(departmentDTO.getId());
        	department.setCode(departmentDTO.getCode());
        	department.setName(departmentDTO.getName());
        	department.setStatus(departmentDTO.getStatus());
        	department.setParent(departmentDTO.getParent());
//        	department.setOffices(departmentDTO.getOffices());
//        	department.setCompanyies(departmentDTO.getCompanyies());
        	
            return department;
        }
    }

    public List<Department> toEntity(List<DepartmentDTO> departmentDTOs) {
        return departmentDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Department> toEntity(Set<DepartmentDTO> departmentDTOs) {
        return departmentDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Department fromId(Long id) {
        if (id == null) {
            return null;
        }
        Department department = new Department();
        department.setId(id);
        return department;
    }
}