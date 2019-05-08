package com.wongs.service.dto;


import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.wongs.domain.MyAccount;
import com.wongs.domain.Product;
import com.wongs.domain.Shop;
import com.wongs.domain.enumeration.CommonStatus;

/**
 * A DTO for the Shop entity.
 */
public class ShopDTO implements Serializable {

    private Long id;

    @NotNull
    private String code;

    private String name;

    private String description;

    private CommonStatus status;
    
    private String permission;

    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    private Set<MyAccount> accounts = new HashSet<>();

    private Set<ProductDTO> products = null;
    
    public ShopDTO() {
        // Empty constructor needed for Jackson.
    }

    public ShopDTO(Shop shop) {
        this.id = shop.getId();
    	this.name = shop.getName();
    	this.code = shop.getCode();
    	this.status = shop.getStatus();
    	this.description = shop.getDescription();
    	this.createdBy = shop.getCreatedBy();
    	this.createdDate = shop.getCreatedDate();
    	this.lastModifiedBy = shop.getLastModifiedBy();
    	this.lastModifiedDate = shop.getLastModifiedDate();
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

    public CommonStatus getStatus() {
        return status;
    }

    public void setStatus(CommonStatus status) {
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
    
    public Set<MyAccount> getAccounts() {
		return accounts;
	}

	public void setAccounts(Set<MyAccount> accounts) {
		this.accounts = accounts;
	}

	public Set<ProductDTO> getProducts() {
		return products;
	}

	public void setProducts(Set<ProductDTO> products) {
		this.products = products;
	}
	
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ShopDTO shopDTO = (ShopDTO) o;
        if(shopDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shopDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShopDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", products=" + getProducts() +
            "}";
    }
}
