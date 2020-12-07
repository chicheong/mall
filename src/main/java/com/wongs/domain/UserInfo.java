package com.wongs.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.util.HashSet;
import java.util.Set;

/**
 * A UserInfo.
 */
@Entity
@Table(name = "user_info")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "userinfo")
public class UserInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "shop_id")
    private Long shopId;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToOne
    @JoinColumn(unique = true)
    private MyAccount defaultAccount;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "user_info_account",
               joinColumns = @JoinColumn(name = "user_info_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "account_id", referencedColumnName = "id"))
    private Set<MyAccount> accounts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAccountId() {
        return accountId;
    }

    public UserInfo accountId(Long accountId) {
        this.accountId = accountId;
        return this;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getShopId() {
        return shopId;
    }

    public UserInfo shopId(Long shopId) {
        this.shopId = shopId;
        return this;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public User getUser() {
        return user;
    }

    public UserInfo user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MyAccount getDefaultAccount() {
        return defaultAccount;
    }

    public UserInfo defaultAccount(MyAccount myAccount) {
        this.defaultAccount = myAccount;
        return this;
    }

    public void setDefaultAccount(MyAccount myAccount) {
        this.defaultAccount = myAccount;
    }

    public Set<MyAccount> getAccounts() {
        return accounts;
    }

    public UserInfo accounts(Set<MyAccount> myAccounts) {
        this.accounts = myAccounts;
        return this;
    }

    public UserInfo addAccount(MyAccount myAccount) {
        this.accounts.add(myAccount);
        myAccount.getUserInfos().add(this);
        return this;
    }

    public UserInfo removeAccount(MyAccount myAccount) {
        this.accounts.remove(myAccount);
        myAccount.getUserInfos().remove(this);
        return this;
    }

    public void setAccounts(Set<MyAccount> myAccounts) {
        this.accounts = myAccounts;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserInfo)) {
            return false;
        }
        return id != null && id.equals(((UserInfo) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "UserInfo{" +
            "id=" + getId() +
            ", accountId=" + getAccountId() +
            ", shopId=" + getShopId() +
            "}";
    }
}
