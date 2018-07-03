package com.wongs.service.dto;


import java.io.Serializable;
import java.util.Objects;

import com.wongs.domain.Address;
import com.wongs.domain.Country;
import com.wongs.domain.State;

/**
 * A DTO for the Address entity.
 */
public class AddressDTO implements Serializable {

    private Long id;

    private String line1;

    private String line2;

    private String line3;

    private String line4;

    private String city;

    private String postalCode;

    private Country country;

    private State state;

    public AddressDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public AddressDTO(Address address) {
        this.id = address.getId();
    	this.line1 = address.getLine1();
    	this.line2 = address.getLine2();
    	this.line3 = address.getLine3();
    	this.line4 = address.getLine4();
    	this.city = address.getCity();
    	this.postalCode = address.getPostalCode();
    	this.country = address.getCountry();
    	this.state = address.getState();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLine1() {
        return line1;
    }

    public void setLine1(String line1) {
        this.line1 = line1;
    }

    public String getLine2() {
        return line2;
    }

    public void setLine2(String line2) {
        this.line2 = line2;
    }

    public String getLine3() {
        return line3;
    }

    public void setLine3(String line3) {
        this.line3 = line3;
    }

    public String getLine4() {
        return line4;
    }

    public void setLine4(String line4) {
        this.line4 = line4;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        AddressDTO addressDTO = (AddressDTO) o;
        if(addressDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), addressDTO.getId()) &&
        		Objects.equals(getLine1(), addressDTO.getLine1()) &&
        		Objects.equals(getLine2(), addressDTO.getLine2()) &&
        		Objects.equals(getLine3(), addressDTO.getLine3()) &&
        		Objects.equals(getLine4(), addressDTO.getLine4()) &&
        		Objects.equals(getCity(), addressDTO.getCity()) &&
        		Objects.equals(getPostalCode(), addressDTO.getPostalCode()) &&
        		Objects.equals(getCountry(), addressDTO.getCountry()) &&
        		Objects.equals(getState(), addressDTO.getState());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AddressDTO{" +
            "id=" + getId() +
            ", line1='" + getLine1() + "'" +
            ", line2='" + getLine2() + "'" +
            ", line3='" + getLine3() + "'" +
            ", line4='" + getLine4() + "'" +
            ", city='" + getCity() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            "}";
    }
}
