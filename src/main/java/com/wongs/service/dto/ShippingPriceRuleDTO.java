package com.wongs.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import com.wongs.domain.ShippingPriceRule;
import com.wongs.domain.Shop;
import com.wongs.domain.enumeration.ShippingPriceRuleType;

/**
 * A DTO for the {@link com.wongs.domain.ShippingPriceRule} entity.
 */
public class ShippingPriceRuleDTO implements Serializable {
    
    private Long id;

    private ShippingPriceRuleType type;

    private BigDecimal value;

    private BigDecimal price;

    private Integer sequence;

    private Shop shop;

    public ShippingPriceRuleDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public ShippingPriceRuleDTO(ShippingPriceRule shippingPriceRule) {
        this.id = shippingPriceRule.getId();
    	this.type = shippingPriceRule.getType();
    	this.value = shippingPriceRule.getValue();
    	this.price = shippingPriceRule.getPrice();
    	this.sequence = shippingPriceRule.getSequence();
    	this.shop = shippingPriceRule.getShop();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ShippingPriceRuleType getType() {
        return type;
    }

    public void setType(ShippingPriceRuleType type) {
        this.type = type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

    public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ShippingPriceRuleDTO shippingPriceRuleDTO = (ShippingPriceRuleDTO) o;
        if (shippingPriceRuleDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shippingPriceRuleDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShippingPriceRuleDTO{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", value=" + getValue() +
            ", price=" + getPrice() +
            ", sequence=" + getSequence() +
            ", shop=" + getShop() +
            "}";
    }
}
