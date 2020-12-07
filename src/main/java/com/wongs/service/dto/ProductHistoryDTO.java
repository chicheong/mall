package com.wongs.service.dto;

import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.wongs.domain.ProductHistory;
import com.wongs.domain.enumeration.ProductStatus;

/**
 * A DTO for the {@link com.wongs.domain.ProductHistory} entity.
 */
public class ProductHistoryDTO implements Serializable {
    
    private Long id;

    private Long productId;

    @NotNull
    private String name;

    private String code;

    private String brand;

    private String description;

    private String content;

    private String remark;

    private ProductStatus status;

    private String createdBy;

    private ZonedDateTime createdDate;

    public ProductHistoryDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public ProductHistoryDTO(ProductHistory productHistory) {
        this.id = productHistory.getId();
    	this.productId = productHistory.getProductId();
    	this.name = productHistory.getName();
    	this.code = productHistory.getCode();
    	this.brand = productHistory.getBrand();
    	this.description = productHistory.getDescription();
    	this.content = productHistory.getContent();
    	this.remark = productHistory.getRemark();
    	this.status = productHistory.getStatus();
    	this.createdBy = productHistory.getCreatedBy();
    	this.createdDate = productHistory.getCreatedDate();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ProductHistoryDTO productHistoryDTO = (ProductHistoryDTO) o;
        if (productHistoryDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productHistoryDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductHistoryDTO{" +
            "id=" + getId() +
            ", productId=" + getProductId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", brand='" + getBrand() + "'" +
            ", description='" + getDescription() + "'" +
            ", content='" + getContent() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
