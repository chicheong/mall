package com.wongs.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import com.wongs.domain.ShippingType;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the {@link com.wongs.domain.ShippingType} entity.
 */
public class ShippingTypeDTO implements Serializable {
    
    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private CurrencyType currency;

    public ShippingTypeDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public ShippingTypeDTO(ShippingType shippingType) {
        this.id = shippingType.getId();
    	this.name = shippingType.getName();
    	this.description = shippingType.getDescription();
    	this.price = shippingType.getPrice();
    	this.currency = shippingType.getCurrency();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ShippingTypeDTO shippingTypeDTO = (ShippingTypeDTO) o;
        if (shippingTypeDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shippingTypeDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShippingTypeDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", price=" + getPrice() +
            ", currency='" + getCurrency() + "'" +
            "}";
    }
}
