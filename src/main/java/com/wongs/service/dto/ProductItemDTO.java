package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import com.wongs.domain.Product;
import com.wongs.domain.ProductItem;
import com.wongs.domain.ProductStyle;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the ProductItem entity.
 */
public class ProductItemDTO implements Serializable {

    private Long id;

    private String code;

    private Boolean isDefault;

    private Integer quantity;

    private CurrencyType currency;

    private BigDecimal price;

    private ProductStyle color;

    private ProductStyle size;

    private Product product;

    public ProductItemDTO() {
        // Empty constructor needed for Jackson.
	}

	public ProductItemDTO(ProductItem productItem) {
		super();
		this.id = productItem.getId();
		this.code = productItem.getCode();
		this.isDefault = productItem.isIsDefault();
		this.quantity = productItem.getQuantity();
		this.currency = productItem.getCurrency();
		this.price = productItem.getPrice();
		this.color = productItem.getColor();
		this.size = productItem.getSize();
		this.product = productItem.getProduct();
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

    public ProductStyle getColor() {
		return color;
	}

	public void setColor(ProductStyle color) {
		this.color = color;
	}

	public ProductStyle getSize() {
		return size;
	}

	public void setSize(ProductStyle size) {
		this.size = size;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ProductItemDTO productItemDTO = (ProductItemDTO) o;
        if(productItemDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productItemDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductItemDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", isDefault='" + isIsDefault() + "'" +
            ", quantity=" + getQuantity() +
            ", currency='" + getCurrency() + "'" +
            ", price=" + getPrice() +
            "}";
    }
}
