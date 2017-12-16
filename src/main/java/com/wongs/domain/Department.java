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
 * A Department.
 */
@Entity
@Table(name = "department")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "department")
public class Department implements Serializable {

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

    @ManyToOne
    private Department parent;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "department_office",
               joinColumns = @JoinColumn(name="departments_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="offices_id", referencedColumnName="id"))
    private Set<Office> offices = new HashSet<>();

    @OneToMany(mappedBy = "department")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<MyAccount> accounts = new HashSet<>();

    @ManyToMany(mappedBy = "departments")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Company> companies = new HashSet<>();

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

    public Department code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public Department name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CommonStatus getStatus() {
        return status;
    }

    public Department status(CommonStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(CommonStatus status) {
        this.status = status;
    }

    public Department getParent() {
        return parent;
    }

    public Department parent(Department department) {
        this.parent = department;
        return this;
    }

    public void setParent(Department department) {
        this.parent = department;
    }

    public Set<Office> getOffices() {
        return offices;
    }

    public Department offices(Set<Office> offices) {
        this.offices = offices;
        return this;
    }

    public Department addOffice(Office office) {
        this.offices.add(office);
        office.getDepartments().add(this);
        return this;
    }

    public Department removeOffice(Office office) {
        this.offices.remove(office);
        office.getDepartments().remove(this);
        return this;
    }

    public void setOffices(Set<Office> offices) {
        this.offices = offices;
    }

    public Set<MyAccount> getAccounts() {
        return accounts;
    }

    public Department accounts(Set<MyAccount> myAccounts) {
        this.accounts = myAccounts;
        return this;
    }

    public Department addAccount(MyAccount myAccount) {
        this.accounts.add(myAccount);
        myAccount.setDepartment(this);
        return this;
    }

    public Department removeAccount(MyAccount myAccount) {
        this.accounts.remove(myAccount);
        myAccount.setDepartment(null);
        return this;
    }

    public void setAccounts(Set<MyAccount> myAccounts) {
        this.accounts = myAccounts;
    }

    public Set<Company> getCompanies() {
        return companies;
    }

    public Department companies(Set<Company> companies) {
        this.companies = companies;
        return this;
    }

    public Department addCompany(Company company) {
        this.companies.add(company);
        company.getDepartments().add(this);
        return this;
    }

    public Department removeCompany(Company company) {
        this.companies.remove(company);
        company.getDepartments().remove(this);
        return this;
    }

    public void setCompanies(Set<Company> companies) {
        this.companies = companies;
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
        Department department = (Department) o;
        if (department.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), department.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Department{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
