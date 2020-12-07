package com.wongs.service.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.wongs.domain.Company;
import com.wongs.domain.enumeration.CommonStatus;

/**
 * A DTO for the {@link com.wongs.domain.Company} entity.
 */
public class CompanyDTO implements Serializable {
    
    private Long id;

    @NotNull
    private String code;

    private String name;

    private CommonStatus status;

    private Company parent;
    private Set<DepartmentDTO> departments = new HashSet<>();
    private Set<OfficeDTO> offices = new HashSet<>();
    
    public CompanyDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public CompanyDTO(Company company) {
        this.id = company.getId();
    	this.code = company.getCode();
    	this.name = company.getName();
    	this.status = company.getStatus();
    	this.parent = company.getParent();
//    	this.departments = company.getDepartments();
//    	this.offices = company.getOffices();
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

    public Company getParent() {
		return parent;
	}

	public void setParent(Company parent) {
		this.parent = parent;
	}

	public Set<DepartmentDTO> getDepartments() {
        return departments;
    }

    public void setDepartments(Set<DepartmentDTO> departments) {
        this.departments = departments;
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

        CompanyDTO companyDTO = (CompanyDTO) o;
        if (companyDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), companyDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CompanyDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            ", parent=" + getParent() +
            ", departments='" + getDepartments() + "'" +
            ", offices='" + getOffices() + "'" +
            "}";
    }
}
