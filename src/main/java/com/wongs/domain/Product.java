package com.wongs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.wongs.domain.enumeration.ProductStatus;


/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "product")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "brand")
    private String brand;

    @Column(name = "description")
    private String description;

    @Column(name = "content")
    private String content;

    @Column(name = "remark")
    private String remark;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProductStatus status;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private ZonedDateTime createdDate;

    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private ZonedDateTime lastModifiedDate;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ProductItem> items = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ProductHistory> histories = new HashSet<>();

    @ManyToOne
    private UserInfo userInfo;

    @ManyToMany(mappedBy = "products")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Category> categories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Product name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public Product code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBrand() {
        return brand;
    }

    public Product brand(String brand) {
        this.brand = brand;
        return this;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public Product description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public Product content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRemark() {
        return remark;
    }

    public Product remark(String remark) {
        this.remark = remark;
        return this;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public Product status(ProductStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public Product createdBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public Product createdDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public Product lastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public Product lastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
        return this;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<ProductItem> getItems() {
        return items;
    }

    public Product items(Set<ProductItem> productItems) {
        this.items = productItems;
        return this;
    }

    public Product addItem(ProductItem productItem) {
        this.items.add(productItem);
        productItem.setProduct(this);
        return this;
    }

    public Product removeItem(ProductItem productItem) {
        this.items.remove(productItem);
        productItem.setProduct(null);
        return this;
    }

    public void setItems(Set<ProductItem> productItems) {
        this.items = productItems;
    }

    public Set<ProductHistory> getHistories() {
        return histories;
    }

    public Product histories(Set<ProductHistory> productHistories) {
        this.histories = productHistories;
        return this;
    }

    public Product addHistory(ProductHistory productHistory) {
        this.histories.add(productHistory);
        productHistory.setProduct(this);
        return this;
    }

    public Product removeHistory(ProductHistory productHistory) {
        this.histories.remove(productHistory);
        productHistory.setProduct(null);
        return this;
    }

    public void setHistories(Set<ProductHistory> productHistories) {
        this.histories = productHistories;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public Product userInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
        return this;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public Product categories(Set<Category> categories) {
        this.categories = categories;
        return this;
    }

    public Product addCategory(Category category) {
        this.categories.add(category);
        category.getProducts().add(this);
        return this;
    }

    public Product removeCategory(Category category) {
        this.categories.remove(category);
        category.getProducts().remove(this);
        return this;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Product product = (Product) o;
        if (product.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), product.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Product{" +
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
            "}";
    }
}
