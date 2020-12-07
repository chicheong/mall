package com.wongs.service.dto;

import java.io.Serializable;
import java.util.Objects;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.wongs.domain.Country;

/**
 * A DTO for the {@link com.wongs.domain.Country} entity.
 */
public class CountryDTO implements Serializable {
    
    private Long id;

    @NotNull
    @Size(max = 2)
    private String code;

    @Size(max = 3)
    private String label;

    @Size(max = 3)
    private String num;

    @Size(max = 100)
    private String name;

    public CountryDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public CountryDTO(Country country) {
        this.id = country.getId();
    	this.code = country.getCode();
    	this.label = country.getLabel();
    	this.num = country.getNum();
    	this.name = country.getName();
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

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CountryDTO countryDTO = (CountryDTO) o;
        if (countryDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), countryDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CountryDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", label='" + getLabel() + "'" +
            ", num='" + getNum() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
