package com.wongs.service.dto;

import java.io.Serializable;
import java.util.Objects;

import com.wongs.domain.Address;
import com.wongs.domain.Contact;

/**
 * A DTO for the {@link com.wongs.domain.Contact} entity.
 */
public class ContactDTO implements Serializable {
    
    private Long id;

    private String name;

    private String name2;

    private String phoneNum;

    private String phoneNum2;

    private String email;

    private String remark;

    private Address address;
    
    public ContactDTO() {
        // Empty constructor needed for Jackson.
    }

    public ContactDTO(Contact contact) {
        this.id = contact.getId();
    	this.name = contact.getName();
    	this.name2 = contact.getName2();
    	this.phoneNum = contact.getPhoneNum();
    	this.phoneNum2 = contact.getPhoneNum2();
    	this.email = contact.getEmail();
    	this.remark = contact.getRemark();
    	this.address = contact.getAddress();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName2() {
        return name2;
    }

    public void setName2(String name2) {
        this.name2 = name2;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getPhoneNum2() {
        return phoneNum2;
    }

    public void setPhoneNum2(String phoneNum2) {
        this.phoneNum2 = phoneNum2;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

        ContactDTO contactDTO = (ContactDTO) o;
        if (contactDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), contactDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ContactDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", name2='" + getName2() + "'" +
            ", phoneNum='" + getPhoneNum() + "'" +
            ", phoneNum2='" + getPhoneNum2() + "'" +
            ", email='" + getEmail() + "'" +
            ", remark='" + getRemark() + "'" +
            ", address=" + getAddress() +
            "}";
    }
}
