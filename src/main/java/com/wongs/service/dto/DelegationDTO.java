package com.wongs.service.dto;

import java.time.ZonedDateTime;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import java.util.Optional;

import com.wongs.domain.enumeration.DelegationType;
import com.wongs.domain.Delegation;
import com.wongs.domain.MyOrder;
import com.wongs.domain.enumeration.CommonStatus;

/**
 * A DTO for the {@link com.wongs.domain.Delegation} entity.
 */
public class DelegationDTO implements Serializable {
    
    private Long id;

    private ZonedDateTime from;

    private ZonedDateTime to;

    private DelegationType type;

    private String delegateId;

    private CommonStatus status;

    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    private Long accountId;

    public DelegationDTO() {
        // Empty constructor needed for Jackson.
    }

    public DelegationDTO(Delegation delegation) {
        this.id = delegation.getId();
    	this.from = delegation.getFrom();
    	this.to = delegation.getTo();
    	this.type = delegation.getType();
    	this.delegateId = delegation.getDelegateId();
    	this.status = delegation.getStatus();
    	this.createdBy = delegation.getCreatedBy();
    	this.createdDate = delegation.getCreatedDate();
    	this.lastModifiedBy = delegation.getLastModifiedBy();
    	this.lastModifiedDate = delegation.getLastModifiedDate();
//    	this.accountId = Optional.of(delegation.getAccount()).get().getId();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFrom() {
        return from;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }

    public ZonedDateTime getTo() {
        return to;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }

    public DelegationType getType() {
        return type;
    }

    public void setType(DelegationType type) {
        this.type = type;
    }

    public String getDelegateId() {
        return delegateId;
    }

    public void setDelegateId(String delegateId) {
        this.delegateId = delegateId;
    }

    public CommonStatus getStatus() {
        return status;
    }

    public void setStatus(CommonStatus status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long myAccountId) {
        this.accountId = myAccountId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        DelegationDTO delegationDTO = (DelegationDTO) o;
        if (delegationDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), delegationDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DelegationDTO{" +
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
