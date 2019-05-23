package com.wongs.service.dto;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the UserInfo entity.
 */
public class UserInfoDTO implements Serializable {

    private Long id;

    private Long accountId;

    private Long shopId;


    private Long userId;

    private String userLogin;

    private Long defaultAccountId;

    private Set<MyAccountDTO> accounts = new HashSet<>();

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    public Long getDefaultAccountId() {
        return defaultAccountId;
    }

    public void setDefaultAccountId(Long myAccountId) {
        this.defaultAccountId = myAccountId;
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
        if (userInfoDTO.getId() == null || getId() == null) {
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
            ", user=" + getUserId() +
            ", user='" + getUserLogin() + "'" +
            ", defaultAccount=" + getDefaultAccountId() +
            "}";
    }
}
