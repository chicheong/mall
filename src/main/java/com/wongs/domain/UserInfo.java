package com.wongs.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A UserInfo.
 */
@Entity
@Table(name = "user_info")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "userinfo")
public class UserInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "user_info_account",
               joinColumns = @JoinColumn(name="user_infos_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="accounts_id", referencedColumnName="id"))
    private Set<MyAccount> accounts = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserInfo userInfo = (UserInfo) o;
        if (userInfo.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userInfo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserInfo{" +
            "id=" + getId() +
            "}";
    }
}
