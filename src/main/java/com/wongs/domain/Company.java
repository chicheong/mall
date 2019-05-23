package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
 * A Company.
 */
@Entity
@Table(name = "company")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "company")
public class Company implements Serializable {

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
    @JsonIgnoreProperties("companies")
    private Company parent;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "company_department",
               joinColumns = @JoinColumn(name = "company_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "department_id", referencedColumnName = "id"))
    private Set<Department> departments = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "company_office",
               joinColumns = @JoinColumn(name = "company_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "office_id", referencedColumnName = "id"))
    private Set<Office> offices = new HashSet<>();

    @OneToMany(mappedBy = "company")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<MyAccount> accounts = new HashSet<>();
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

    public Company code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public Company name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CommonStatus getStatus() {
        return status;
    }

    public Company status(CommonStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(CommonStatus status) {
        this.status = status;
    }

    public Company getParent() {
        return parent;
    }

    public Company parent(Company company) {
        this.parent = company;
        return this;
    }

    public void setParent(Company company) {
        this.parent = company;
    }

    public Set<Department> getDepartments() {
        return departments;
    }

    public Company departments(Set<Department> departments) {
        this.departments = departments;
        return this;
    }

    public Company addDepartment(Department department) {
        this.departments.add(department);
        department.getCompanies().add(this);
        return this;
    }

    public Company removeDepartment(Department department) {
        this.departments.remove(department);
        department.getCompanies().remove(this);
        return this;
    }

    public void setDepartments(Set<Department> departments) {
        this.departments = departments;
    }

    public Set<Office> getOffices() {
        return offices;
    }

    public Company offices(Set<Office> offices) {
        this.offices = offices;
        return this;
    }

    public Company addOffice(Office office) {
        this.offices.add(office);
        office.getCompanies().add(this);
        return this;
    }

    public Company removeOffice(Office office) {
        this.offices.remove(office);
        office.getCompanies().remove(this);
        return this;
    }

    public void setOffices(Set<Office> offices) {
        this.offices = offices;
    }

    public Set<MyAccount> getAccounts() {
        return accounts;
    }

    public Company accounts(Set<MyAccount> myAccounts) {
        this.accounts = myAccounts;
        return this;
    }

    public Company addAccount(MyAccount myAccount) {
        this.accounts.add(myAccount);
        myAccount.setCompany(this);
        return this;
    }

    public Company removeAccount(MyAccount myAccount) {
        this.accounts.remove(myAccount);
        myAccount.setCompany(null);
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
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Company company = (Company) o;
        if (company.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), company.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Company{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
