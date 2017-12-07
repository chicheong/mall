package com.wongs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.wongs.domain.enumeration.CurrencyType;


/**
 * A ProductItem.
 */
@Entity
@Table(name = "product_item")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "productitem")
public class ProductItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "default_item")
    private Boolean defaultItem;

    @Column(name = "color")
    private String color;

    @Column(name = "jhi_size")
    private String size;

    @Column(name = "quantity")
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @Column(name = "price", precision=10, scale=2)
    private BigDecimal price;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private ZonedDateTime createdDate;

    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Column(name = "last_modified_date")
    private ZonedDateTime lastModifiedDate;

    @OneToMany(mappedBy = "item")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ProductItemHistory> histories = new HashSet<>();

    @OneToMany(mappedBy = "item")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Price> prices = new HashSet<>();

    @OneToOne(mappedBy = "productItem")
    @JsonIgnore
    private OrderItem orderItem;

    @ManyToOne
    private Product product;

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

    public ProductItem name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public ProductItem code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Boolean isDefaultItem() {
        return defaultItem;
    }

    public ProductItem defaultItem(Boolean defaultItem) {
        this.defaultItem = defaultItem;
        return this;
    }

    public void setDefaultItem(Boolean defaultItem) {
        this.defaultItem = defaultItem;
    }

    public String getColor() {
        return color;
    }

    public ProductItem color(String color) {
        this.color = color;
        return this;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public ProductItem size(String size) {
        this.size = size;
        return this;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductItem quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public ProductItem currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public ProductItem price(BigDecimal price) {
        this.price = price;
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public ProductItem createdBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public ProductItem createdDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public ProductItem lastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public ProductItem lastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
        return this;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<ProductItemHistory> getHistories() {
        return histories;
    }

    public ProductItem histories(Set<ProductItemHistory> productItemHistories) {
        this.histories = productItemHistories;
        return this;
    }

    public ProductItem addHistory(ProductItemHistory productItemHistory) {
        this.histories.add(productItemHistory);
        productItemHistory.setItem(this);
        return this;
    }

    public ProductItem removeHistory(ProductItemHistory productItemHistory) {
        this.histories.remove(productItemHistory);
        productItemHistory.setItem(null);
        return this;
    }

    public void setHistories(Set<ProductItemHistory> productItemHistories) {
        this.histories = productItemHistories;
    }

    public Set<Price> getPrices() {
        return prices;
    }

    public ProductItem prices(Set<Price> prices) {
        this.prices = prices;
        return this;
    }

    public ProductItem addPrice(Price price) {
        this.prices.add(price);
        price.setItem(this);
        return this;
    }

    public ProductItem removePrice(Price price) {
        this.prices.remove(price);
        price.setItem(null);
        return this;
    }

    public void setPrices(Set<Price> prices) {
        this.prices = prices;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public ProductItem orderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
        return this;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public Product getProduct() {
        return product;
    }

    public ProductItem product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
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
        ProductItem productItem = (ProductItem) o;
        if (productItem.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productItem.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductItem{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", defaultItem='" + isDefaultItem() + "'" +
            ", color='" + getColor() + "'" +
            ", size='" + getSize() + "'" +
            ", quantity=" + getQuantity() +
            ", currency='" + getCurrency() + "'" +
            ", price=" + getPrice() +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
