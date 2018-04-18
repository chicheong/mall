package com.wongs.service.dto;


import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.wongs.domain.MyAccount;
import com.wongs.domain.User;
import com.wongs.domain.UserInfo;

/**
 * A DTO for the UserInfo entity.
 */
public class UserInfoDTO implements Serializable {

    private Long id;

    private Long accountId;

    private Long shopId;

    private User user;

    private MyAccount defaultAccount;

    private Set<MyAccountDTO> accounts = new HashSet<>();

    public UserInfoDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public UserInfoDTO(UserInfo userInfo) {
        this.id = userInfo.getId();
    	this.accountId = userInfo.getAccountId();
    	this.shopId = userInfo.getShopId();
    	this.user = userInfo.getUser();
    	this.defaultAccount = userInfo.getDefaultAccount();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MyAccount getDefaultAccount() {
        return defaultAccount;
    }

    public void setDefaultAccountId(MyAccount myAccount) {
        this.defaultAccount = myAccount;
    }

    public Set<MyAccountDTO> getAccounts() {
        return accounts;
    }

    public void setAccounts(Set<MyAccountDTO> myAccounts) {
        this.accounts = myAccounts;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        UserInfoDTO userInfoDTO = (UserInfoDTO) o;
        if(userInfoDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userInfoDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserInfoDTO{" +
            "id=" + getId() +
            ", accountId=" + getAccountId() +
            ", shopId=" + getShopId() +
            "}";
    }
}
