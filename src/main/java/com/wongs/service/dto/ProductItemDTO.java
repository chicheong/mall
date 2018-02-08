package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.wongs.domain.Price;
import com.wongs.domain.Product;
import com.wongs.domain.ProductItem;
import com.wongs.domain.ProductStyle;
import com.wongs.domain.Quantity;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the ProductItem entity.
 */
public class ProductItemDTO implements Serializable {

    private Long id;
    
    private String tempId;

    private String code;

    private Boolean isDefault;

    private Integer quantity;

    private CurrencyType currency;

    private BigDecimal price;

    private ProductStyleDTO color;

    private ProductStyleDTO size;

    private Product product;

    private Set<PriceDTO> prices = new HashSet<>();
    private Set<QuantityDTO> quantities = new HashSet<>();
    
    private boolean dirtyPrices = false;
    private boolean dirtyQuantities = false;
    
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
//		this.color = productItem.getColor();
//		this.size = productItem.getSize();
		this.product = productItem.getProduct();
		
//		this.prices = productItem.getPrices();
//		this.quantities = productItem.getQuantities();
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTempId() {
		return tempId;
	}

	public void setTempId(String tempId) {
		this.tempId = tempId;
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

	public ProductStyleDTO getColor() {
		return color;
	}

	public void setColor(ProductStyleDTO color) {
		this.color = color;
	}

	public ProductStyleDTO getSize() {
		return size;
	}

	public void setSize(ProductStyleDTO size) {
		this.size = size;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Set<PriceDTO> getPrices() {
		return prices;
	}

	public void setPrices(Set<PriceDTO> prices) {
		this.prices = prices;
	}

	public Set<QuantityDTO> getQuantities() {
		return quantities;
	}

	public void setQuantities(Set<QuantityDTO> quantities) {
		this.quantities = quantities;
	}

	public boolean isDirtyPrices() {
		return dirtyPrices;
	}

	public void setDirtyPrices(boolean dirtyPrices) {
		this.dirtyPrices = dirtyPrices;
	}

	public boolean isDirtyQuantities() {
		return dirtyQuantities;
	}

	public void setDirtyQuantities(boolean dirtyQuantities) {
		this.dirtyQuantities = dirtyQuantities;
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
