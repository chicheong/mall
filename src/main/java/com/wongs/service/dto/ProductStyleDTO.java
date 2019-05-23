package com.wongs.service.dto;
import java.io.Serializable;
import java.util.Objects;
import com.wongs.domain.enumeration.ProductStyleType;

/**
 * A DTO for the ProductStyle entity.
 */
public class ProductStyleDTO implements Serializable {

    private Long id;

    private String name;

    private String code;

    private Boolean isDefault;

    private ProductStyleType type;


    private Long productId;

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

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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
        if (productStyleDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productStyleDTO.getId());
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
            ", product=" + getProductId() +
            "}";
    }
}
