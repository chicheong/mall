package com.wongs.web.rest.vm;

import com.wongs.config.Constants;
import com.wongs.domain.Category;
import com.wongs.domain.Product;
import com.wongs.domain.ProductHistory;
import com.wongs.domain.ProductItem;
import com.wongs.domain.UserInfo;
import com.wongs.domain.enumeration.ProductStatus;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * View Model object for storing a product with items
 */
public class ProductVM {

    private Long id;

    private String name;

    private String code;

    private String brand;

    private String description;

    private String content;

    private String remark;

    private ProductStatus status;

    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    private Set<ProductItem> items = new HashSet<>();

    private Set<ProductHistory> histories = new HashSet<>();

    private UserInfo userInfo;
    
    private Set<Category> categories = new HashSet<>();

    public ProductVM() {
		super();
	}
    
    public ProductVM(Product product) {
    	this(product.getId(), product.getName(), product.getCode(), product.getBrand(), product.getDescription(),
    			product.getContent(), product.getRemark(), product.getStatus(), product.getCreatedBy(),
    			product.getCreatedDate(), product.getLastModifiedBy(), product.getLastModifiedDate(),
    			product.getItems(), product.getHistories(), product.getUserInfo(), product.getCategories());
    }

	public ProductVM(Long id, String name, String code, String brand, String description, String content, String remark,
			ProductStatus status, String createdBy, ZonedDateTime createdDate, String lastModifiedBy,
			ZonedDateTime lastModifiedDate, Set<ProductItem> items, Set<ProductHistory> histories, UserInfo userInfo,
			Set<Category> categories) {
		super();
		this.id = id;
		this.name = name;
		this.code = code;
		this.brand = brand;
		this.description = description;
		this.content = content;
		this.remark = remark;
		this.status = status;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.lastModifiedBy = lastModifiedBy;
		this.lastModifiedDate = lastModifiedDate;
		this.items = items;
		this.histories = histories;
		this.userInfo = userInfo;
		this.categories = categories;
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

    public ProductVM name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public ProductVM code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBrand() {
    	return brand;
    }

    public ProductVM brand(String brand) {
        this.brand = brand;
        return this;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public ProductVM description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public ProductVM content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRemark() {
        return remark;
    }

    public ProductVM remark(String remark) {
        this.remark = remark;
        return this;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public ProductVM status(ProductStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public ProductVM createdBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public ProductVM createdDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public ProductVM lastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public ProductVM lastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
        return this;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<ProductItem> getItems() {
        return items;
    }

    public void setItems(Set<ProductItem> productItems) {
        this.items = productItems;
    }

    public Set<ProductHistory> getHistories() {
        return histories;
    }

    public void setHistories(Set<ProductHistory> productHistories) {
        this.histories = productHistories;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

}
