package com.wongs.service.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.wongs.domain.Address;
import com.wongs.domain.Office;
import com.wongs.domain.enumeration.CommonStatus;

/**
 * A DTO for the {@link com.wongs.domain.Office} entity.
 */
public class OfficeDTO implements Serializable {
    
    private Long id;

    @NotNull
    private String code;

    private String name;

    private CommonStatus status;

    private Address address;
    
    public OfficeDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public OfficeDTO(Office office) {
        this.id = office.getId();
    	this.code = office.getCode();
    	this.name = office.getName();
    	this.status = office.getStatus();
    	this.address = office.getAddress();
//    	this.companyies = office.getCompanyies();
//    	this.departments = office.getDepartments();
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

    public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        OfficeDTO officeDTO = (OfficeDTO) o;
        if (officeDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), officeDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OfficeDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            ", address=" + getAddress() +
            "}";
    }
}
