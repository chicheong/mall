package com.wongs.service.dto;

import java.io.Serializable;
import java.util.Objects;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.wongs.domain.Country;
import com.wongs.domain.MyState;

/**
 * A DTO for the {@link com.wongs.domain.MyState} entity.
 */
public class MyStateDTO implements Serializable {
    
    private Long id;

    @NotNull
    @Size(max = 2)
    private String code;

    @Size(max = 3)
    private String label;

    @Size(max = 100)
    private String name;


    private Country country;

    public MyStateDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public MyStateDTO(MyState myState) {
        this.id = myState.getId();
    	this.code = myState.getCode();
    	this.label = myState.getLabel();
    	this.name = myState.getName();
    	this.country = myState.getCountry();
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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Country getCountry() {
		return country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        MyStateDTO myStateDTO = (MyStateDTO) o;
        if (myStateDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), myStateDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MyStateDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", label='" + getLabel() + "'" +
            ", name='" + getName() + "'" +
            ", country=" + getCountry() +
            "}";
    }
}
