package com.wongs.service.dto;

import java.time.ZonedDateTime;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import com.wongs.domain.ProductItemHistory;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the {@link com.wongs.domain.ProductItemHistory} entity.
 */
public class ProductItemHistoryDTO implements Serializable {
    
    private Long id;

    private String code;

    private Boolean isDefault;

    private Integer quantity;

    private CurrencyType currency;

    private BigDecimal price;

    private String createdBy;

    private ZonedDateTime createdDate;

	
    public ProductItemHistoryDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public ProductItemHistoryDTO(ProductItemHistory productItemHistory) {
        this.id = productItemHistory.getId();
    	this.code = productItemHistory.getCode();
    	this.isDefault = productItemHistory.isIsDefault();
    	this.quantity = productItemHistory.getQuantity();
    	this.currency = productItemHistory.getCurrency();
    	this.price = productItemHistory.getPrice();
    	this.createdBy = productItemHistory.getCreatedBy();
    	this.createdDate = productItemHistory.getCreatedDate();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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

        ProductItemHistoryDTO productItemHistoryDTO = (ProductItemHistoryDTO) o;
        if (productItemHistoryDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productItemHistoryDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductItemHistoryDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", isDefault='" + isIsDefault() + "'" +
            ", quantity=" + getQuantity() +
            ", currency='" + getCurrency() + "'" +
            ", price=" + getPrice() +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
