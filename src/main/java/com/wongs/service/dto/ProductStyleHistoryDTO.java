package com.wongs.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.ProductStyleHistory;
import com.wongs.domain.enumeration.ProductStyleType;

/**
 * A DTO for the {@link com.wongs.domain.ProductStyleHistory} entity.
 */
public class ProductStyleHistoryDTO implements Serializable {
    
    private Long id;

    private String name;

    private String code;

    private Boolean isDefault;

    private ProductStyleType type;

    private String createdBy;

    private ZonedDateTime createdDate;

    public ProductStyleHistoryDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public ProductStyleHistoryDTO(ProductStyleHistory productStyleHistory) {
        this.id = productStyleHistory.getId();
    	this.name = productStyleHistory.getName();
    	this.code = productStyleHistory.getCode();
    	this.isDefault = productStyleHistory.isIsDefault();
    	this.type = productStyleHistory.getType();
    	this.createdBy = productStyleHistory.getCreatedBy();
    	this.createdDate = productStyleHistory.getCreatedDate();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Boolean isIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public ProductStyleType getType() {
        return type;
    }

    public void setType(ProductStyleType type) {
        this.type = type;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ProductStyleHistoryDTO productStyleHistoryDTO = (ProductStyleHistoryDTO) o;
        if (productStyleHistoryDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productStyleHistoryDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductStyleHistoryDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", isDefault='" + isIsDefault() + "'" +
            ", type='" + getType() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
