package com.wongs.service.dto;

import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.Objects;

import com.wongs.domain.Category;
import com.wongs.domain.Product;
import com.wongs.domain.ProductHistory;
import com.wongs.domain.ProductItem;
import com.wongs.domain.ProductStyle;
import com.wongs.domain.Url;
import com.wongs.domain.enumeration.ProductStatus;
import com.wongs.domain.enumeration.ProductStyleType;

/**
 * A DTO for the {@link com.wongs.domain.Product} entity.
 */
public class ProductDTO implements Serializable {
    
    private Long id;

    @NotNull
    private String name;

    private String code;

    private String brand;

    private String description;

    private String content;

    private String remark;

    private ProductStatus status;

    private String permission;
    
    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    private Set<ProductStyleDTO> colors = new HashSet<>();
    private Set<ProductStyleDTO> sizes = new HashSet<>();	
    private Set<ProductItemDTO> items = new HashSet<>();
    private Set<UrlDTO> urls = new HashSet<>();
    private Set<Category> categories = new HashSet<>();
    private Long shopId;

    public ProductDTO() {
        // Empty constructor needed for Jackson.
    }

    public ProductDTO(Product product) {
        this.id = product.getId();
    	this.name = product.getName();
    	this.code = product.getCode();
    	this.brand = product.getBrand();
    	this.description = product.getDescription();
    	this.content = product.getContent();
    	this.remark = product.getRemark();
    	this.status = product.getStatus();
    	this.createdBy = product.getCreatedBy();
    	this.createdDate = product.getCreatedDate();
    	this.lastModifiedBy = product.getLastModifiedBy();
    	this.lastModifiedDate = product.getLastModifiedDate();
    	
//    	this.colors = product.getStyles().stream().filter(style -> ProductStyleType.SIZE.equals(style.getType())).collect(Collectors.toSet());
//    	this.sizes = product.getStyles().stream().filter(style -> ProductStyleType.COLOR.equals(style.getType())).collect(Collectors.toSet());
//    	this.items = product.getItems();
    	this.categories = product.getCategories();
    	this.shopId = product.getShop() != null? product.getShop().getId() : 0L;
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

    public String getPermission() {
		return permission;
	}

	public void setPermission(String permission) {
		this.permission = permission;
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

	public Set<ProductStyleDTO> getColors() {
		return colors;
	}

	public void setColors(Set<ProductStyleDTO> colors) {
		this.colors = colors;
	}

	public Set<ProductStyleDTO> getSizes() {
		return sizes;
	}

	public void setSizes(Set<ProductStyleDTO> sizes) {
		this.sizes = sizes;
	}

	public Set<ProductItemDTO> getItems() {
		return items;
	}

	public void setItems(Set<ProductItemDTO> items) {
		this.items = items;
	}

	public Set<UrlDTO> getUrls() {
		return urls;
	}

	public void setUrls(Set<UrlDTO> urls) {
		this.urls = urls;
	}
	
	public Set<Category> getCategories() {
		return categories;
	}

	public void setCategories(Set<Category> categories) {
		this.categories = categories;
	}

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ProductDTO productDTO = (ProductDTO) o;
        if (productDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", brand='" + getBrand() + "'" +
            ", description='" + getDescription() + "'" +
            ", content='" + getContent() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", shopId=" + getShopId() +
            "}";
    }
}
