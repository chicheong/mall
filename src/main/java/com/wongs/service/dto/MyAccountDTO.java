package com.wongs.service.dto;


import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.wongs.domain.Company;
import com.wongs.domain.Delegation;
import com.wongs.domain.Department;
import com.wongs.domain.MyAccount;
import com.wongs.domain.MyOrder;
import com.wongs.domain.Office;
import com.wongs.domain.Shop;
import com.wongs.domain.UserInfo;
import com.wongs.domain.enumeration.AccountType;

/**
 * A DTO for the MyAccount entity.
 */
public class MyAccountDTO implements Serializable {

    private Long id;

    private AccountType type;
    
    private Set<Delegation> delegations = new HashSet<>();

	private Company company;

//    private String companyCode;

    private Department department;

    private Office office;

    private Set<ShopDTO> shops = new HashSet<>();
    
    private Set<UserInfo> userInfos = new HashSet<>();
    
    private MyOrderDTO myOrder = null;
    
    public MyAccountDTO() {
        // Empty constructor needed for Jackson.
	}
    
    public MyAccountDTO(MyAccount myAccount) {
		this.id = myAccount.getId();
		this.type = myAccount.getType();
	}
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }
    
    public Set<Delegation> getDelegations() {
		return delegations;
	}

	public void setDelegations(Set<Delegation> delegations) {
		this.delegations = delegations;
	}

    public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public Office getOffice() {
		return office;
	}

	public void setOffice(Office office) {
		this.office = office;
	}

	public Set<ShopDTO> getShops() {
        return shops;
    }

    public void setShops(Set<ShopDTO> shops) {
        this.shops = shops;
    }
    
	public Set<UserInfo> getUserInfos() {
		return userInfos;
	}

	public void setUserInfos(Set<UserInfo> userInfos) {
		this.userInfos = userInfos;
	}
    
    public MyOrderDTO getMyOrder() {
		return myOrder;
	}

	public void setMyOrder(MyOrderDTO myOrder) {
		this.myOrder = myOrder;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        MyAccountDTO myAccountDTO = (MyAccountDTO) o;
        if(myAccountDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), myAccountDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MyAccountDTO{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            "}";
    }
}
