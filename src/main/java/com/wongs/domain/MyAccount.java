package com.wongs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.wongs.domain.enumeration.AccountType;

/**
 * A MyAccount.
 */
@Entity
@Table(name = "my_account")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "myaccount")
public class MyAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "balance", precision = 21, scale = 2)
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private AccountType type;

    @OneToMany(mappedBy = "account")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Delegation> delegations = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("myAccounts")
    private Company company;

    @ManyToOne
    @JsonIgnoreProperties("myAccounts")
    private Department department;

    @ManyToOne
    @JsonIgnoreProperties("myAccounts")
    private Office office;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "my_account_shop",
               joinColumns = @JoinColumn(name = "my_account_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "shop_id", referencedColumnName = "id"))
    private Set<Shop> shops = new HashSet<>();

    @ManyToMany(mappedBy = "accounts")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<UserInfo> userInfos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public MyAccount balance(BigDecimal balance) {
        this.balance = balance;
        return this;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public AccountType getType() {
        return type;
    }

    public MyAccount type(AccountType type) {
        this.type = type;
        return this;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public Set<Delegation> getDelegations() {
        return delegations;
    }

    public MyAccount delegations(Set<Delegation> delegations) {
        this.delegations = delegations;
        return this;
    }

    public MyAccount addDelegation(Delegation delegation) {
        this.delegations.add(delegation);
        delegation.setAccount(this);
        return this;
    }

    public MyAccount removeDelegation(Delegation delegation) {
        this.delegations.remove(delegation);
        delegation.setAccount(null);
        return this;
    }

    public void setDelegations(Set<Delegation> delegations) {
        this.delegations = delegations;
    }

    public Company getCompany() {
        return company;
    }

    public MyAccount company(Company company) {
        this.company = company;
        return this;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Department getDepartment() {
        return department;
    }

    public MyAccount department(Department department) {
        this.department = department;
        return this;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Office getOffice() {
        return office;
    }

    public MyAccount office(Office office) {
        this.office = office;
        return this;
    }

    public void setOffice(Office office) {
        this.office = office;
    }

    public Set<Shop> getShops() {
        return shops;
    }

    public MyAccount shops(Set<Shop> shops) {
        this.shops = shops;
        return this;
    }

    public MyAccount addShop(Shop shop) {
        this.shops.add(shop);
        shop.getAccounts().add(this);
        return this;
    }

    public MyAccount removeShop(Shop shop) {
        this.shops.remove(shop);
        shop.getAccounts().remove(this);
        return this;
    }

    public void setShops(Set<Shop> shops) {
        this.shops = shops;
    }

    public Set<UserInfo> getUserInfos() {
        return userInfos;
    }

    public MyAccount userInfos(Set<UserInfo> userInfos) {
        this.userInfos = userInfos;
        return this;
    }

    public MyAccount addUserInfo(UserInfo userInfo) {
        this.userInfos.add(userInfo);
        userInfo.getAccounts().add(this);
        return this;
    }

    public MyAccount removeUserInfo(UserInfo userInfo) {
        this.userInfos.remove(userInfo);
        userInfo.getAccounts().remove(this);
        return this;
    }

    public void setUserInfos(Set<UserInfo> userInfos) {
        this.userInfos = userInfos;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MyAccount)) {
            return false;
        }
        return id != null && id.equals(((MyAccount) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "MyAccount{" +
            "id=" + getId() +
            ", balance=" + getBalance() +
            ", type='" + getType() + "'" +
            "}";
    }
}
