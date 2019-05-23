package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.wongs.domain.enumeration.CommonStatus;

/**
 * A Office.
 */
@Entity
@Table(name = "office")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "office")
public class Office implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CommonStatus status;

    @OneToOne
    @JoinColumn(unique = true)
    private Address address;

    @OneToMany(mappedBy = "office")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<MyAccount> accounts = new HashSet<>();
    @ManyToMany(mappedBy = "offices")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Company> companies = new HashSet<>();

    @ManyToMany(mappedBy = "offices")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Department> departments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public Office code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public Office name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CommonStatus getStatus() {
        return status;
    }

    public Office status(CommonStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(CommonStatus status) {
        this.status = status;
    }

    public Address getAddress() {
        return address;
    }

    public Office address(Address address) {
        this.address = address;
        return this;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Set<MyAccount> getAccounts() {
        return accounts;
    }

    public Office accounts(Set<MyAccount> myAccounts) {
        this.accounts = myAccounts;
        return this;
    }

    public Office addAccount(MyAccount myAccount) {
        this.accounts.add(myAccount);
        myAccount.setOffice(this);
        return this;
    }

    public Office removeAccount(MyAccount myAccount) {
        this.accounts.remove(myAccount);
        myAccount.setOffice(null);
        return this;
    }

    public void setAccounts(Set<MyAccount> myAccounts) {
        this.accounts = myAccounts;
    }

    public Set<Company> getCompanies() {
        return companies;
    }

    public Office companies(Set<Company> companies) {
        this.companies = companies;
        return this;
    }

    public Office addCompany(Company company) {
        this.companies.add(company);
        company.getOffices().add(this);
        return this;
    }

    public Office removeCompany(Company company) {
        this.companies.remove(company);
        company.getOffices().remove(this);
        return this;
    }

    public void setCompanies(Set<Company> companies) {
        this.companies = companies;
    }

    public Set<Department> getDepartments() {
        return departments;
    }

    public Office departments(Set<Department> departments) {
        this.departments = departments;
        return this;
    }

    public Office addDepartment(Department department) {
        this.departments.add(department);
        department.getOffices().add(this);
        return this;
    }

    public Office removeDepartment(Department department) {
        this.departments.remove(department);
        department.getOffices().remove(this);
        return this;
    }

    public void setDepartments(Set<Department> departments) {
        this.departments = departments;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Office office = (Office) o;
        if (office.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), office.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Office{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
