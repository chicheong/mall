package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
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

    @Column(name = "code")
    private String code;

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "quantity")
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @OneToOne
    @JoinColumn(unique = false) //@JsonIgnore
    private ProductStyle color;

    @OneToOne
    @JoinColumn(unique = false) //@JsonIgnore
    private ProductStyle size;

    @OneToMany(mappedBy = "item")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Price> prices = new HashSet<>();
    
    @OneToMany(mappedBy = "item")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Quantity> quantities = new HashSet<>();
    
    @ManyToOne
    @JsonIgnoreProperties("items")
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean isIsDefault() {
        return isDefault;
    }

    public ProductItem isDefault(Boolean isDefault) {
        this.isDefault = isDefault;
        return this;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
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

    public ProductStyle getColor() {
        return color;
    }

    public ProductItem color(ProductStyle productStyle) {
        this.color = productStyle;
        return this;
    }

    public void setColor(ProductStyle productStyle) {
        this.color = productStyle;
    }

    public ProductStyle getSize() {
        return size;
    }

    public ProductItem size(ProductStyle productStyle) {
        this.size = productStyle;
        return this;
    }

    public void setSize(ProductStyle productStyle) {
        this.size = productStyle;
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

    public Set<Quantity> getQuantities() {
        return quantities;
    }

    public ProductItem quantities(Set<Quantity> quantities) {
        this.quantities = quantities;
        return this;
    }

    public ProductItem addQuantity(Quantity quantity) {
        this.quantities.add(quantity);
        quantity.setItem(this);
        return this;
    }

    public ProductItem removeQuantity(Quantity quantity) {
        this.quantities.remove(quantity);
        quantity.setItem(null);
        return this;
    }

    public void setQuantities(Set<Quantity> quantities) {
        this.quantities = quantities;
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
            ", code='" + getCode() + "'" +
            ", isDefault='" + isIsDefault() + "'" +
            ", quantity=" + getQuantity() +
            ", currency='" + getCurrency() + "'" +
            ", price=" + getPrice() +
            "}";
    }
}
