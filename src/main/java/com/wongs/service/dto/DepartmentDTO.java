package com.wongs.service.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.wongs.domain.Department;
import com.wongs.domain.enumeration.CommonStatus;

/**
 * A DTO for the {@link com.wongs.domain.Department} entity.
 */
public class DepartmentDTO implements Serializable {
    
    private Long id;

    @NotNull
    private String code;

    private String name;

    private CommonStatus status;


    private Department parent;
    private Set<OfficeDTO> offices = new HashSet<>();
    
    public DepartmentDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public DepartmentDTO(Department department) {
        this.id = department.getId();
    	this.code = department.getCode();
    	this.name = department.getName();
    	this.status = department.getStatus();
    	this.parent = department.getParent();
//    	this.offices = department.getOffices();
//    	this.companyies = department.getCompanyies();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CommonStatus getStatus() {
        return status;
    }

    public void setStatus(CommonStatus status) {
        this.status = status;
    }

    public Department getParent() {
		return parent;
	}

	public void setParent(Department parent) {
		this.parent = parent;
	}

	public Set<OfficeDTO> getOffices() {
        return offices;
    }

    public void setOffices(Set<OfficeDTO> offices) {
        this.offices = offices;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        DepartmentDTO departmentDTO = (DepartmentDTO) o;
        if (departmentDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), departmentDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DepartmentDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            ", parent=" + getParent() +
            ", offices='" + getOffices() + "'" +
            "}";
    }
}
