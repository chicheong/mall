package com.wongs.service.dto;


import java.io.Serializable;
import java.util.Objects;

import com.wongs.domain.Product;
import com.wongs.domain.ProductStyle;
import com.wongs.domain.enumeration.ProductStyleType;

/**
 * A DTO for the ProductStyle entity.
 */
public class ProductStyleDTO implements Serializable {

    private Long id;
    
    private String tempId;

    private String name;

    private String code;

    private Boolean isDefault;

    private ProductStyleType type;

    private Product product;

    public ProductStyleDTO() {
        // Empty constructor needed for Jackson.
	}
    
	public ProductStyleDTO(ProductStyle productStyle) {
		this.id = productStyle.getId();
		this.name = productStyle.getName();
		this.code = productStyle.getCode();
		this.isDefault = productStyle.isIsDefault();
		this.type = productStyle.getType();
		this.product = productStyle.getProduct();
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

        ProductStyleDTO productStyleDTO = (ProductStyleDTO) o;
        if(productStyleDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productStyleDTO.getId()) &&
        		Objects.equals(getName(), productStyleDTO.getName()) &&
        		Objects.equals(getCode(), productStyleDTO.getCode()) &&
        		Objects.equals(isIsDefault(), productStyleDTO.isIsDefault());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductStyleDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", isDefault='" + isIsDefault() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
