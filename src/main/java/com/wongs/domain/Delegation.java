package com.wongs.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.enumeration.DelegationType;

import com.wongs.domain.enumeration.CommonStatus;

/**
 * A Delegation.
 */
@Entity
@Table(name = "delegation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "delegation")
public class Delegation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jhi_from")
    private ZonedDateTime from;

    @Column(name = "jhi_to")
    private ZonedDateTime to;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type")
    private DelegationType type;

    @Column(name = "delegate_id")
    private String delegateId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CommonStatus status;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private ZonedDateTime createdDate;

    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private ZonedDateTime lastModifiedDate;

    @ManyToOne
    private MyAccount account;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFrom() {
        return from;
    }

    public Delegation from(ZonedDateTime from) {
        this.from = from;
        return this;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }

    public ZonedDateTime getTo() {
        return to;
    }

    public Delegation to(ZonedDateTime to) {
        this.to = to;
        return this;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }

    public DelegationType getType() {
        return type;
    }

    public Delegation type(DelegationType type) {
        this.type = type;
        return this;
    }

    public void setType(DelegationType type) {
        this.type = type;
    }

    public String getDelegateId() {
        return delegateId;
    }

    public Delegation delegateId(String delegateId) {
        this.delegateId = delegateId;
        return this;
    }

    public void setDelegateId(String delegateId) {
        this.delegateId = delegateId;
    }

    public CommonStatus getStatus() {
        return status;
    }

    public Delegation status(CommonStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(CommonStatus status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public Delegation createdBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public Delegation createdDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public Delegation lastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public Delegation lastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
        return this;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public MyAccount getAccount() {
        return account;
    }

    public Delegation account(MyAccount myAccount) {
        this.account = myAccount;
        return this;
    }

    public void setAccount(MyAccount myAccount) {
        this.account = myAccount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Delegation delegation = (Delegation) o;
        if (delegation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), delegation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Delegation{" +
            "id=" + getId() +
            ", from='" + getFrom() + "'" +
            ", to='" + getTo() + "'" +
            ", type='" + getType() + "'" +
            ", delegateId='" + getDelegateId() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
