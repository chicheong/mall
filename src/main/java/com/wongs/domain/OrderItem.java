package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import com.wongs.domain.enumeration.CurrencyType;

/**
 * A OrderItem.
 */
@Entity
@Table(name = "order_item")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "orderitem")
public class OrderItem implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @OneToOne
    @JoinColumn(unique = false) //@JsonIgnore
    private ProductItem productItem;

    @ManyToOne
    @JsonIgnoreProperties("items")
    private OrderShop shop;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public OrderItem quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public OrderItem price(BigDecimal price) {
        this.price = price;
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public OrderItem currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public ProductItem getProductItem() {
        return productItem;
    }

    public OrderItem productItem(ProductItem productItem) {
        this.productItem = productItem;
        return this;
    }

    public void setProductItem(ProductItem productItem) {
        this.productItem = productItem;
    }

    public OrderShop getShop() {
        return shop;
    }

    public OrderItem shop(OrderShop orderShop) {
        this.shop = orderShop;
        return this;
    }

    public void setShop(OrderShop orderShop) {
        this.shop = orderShop;
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
        OrderItem orderItem = (OrderItem) o;
        if (orderItem.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), orderItem.getId()) &&
        		Objects.equals(getQuantity(), orderItem.getQuantity()) &&
        		(getPrice().compareTo(orderItem.getPrice()) == 0) &&
        		Objects.equals(getCurrency(), orderItem.getCurrency()) && 
        		(getProductItem() == null && orderItem.getProductItem() == null)?true:Objects.equals(getProductItem().getId(), orderItem.getProductItem().getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OrderItem{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", price=" + getPrice() +
            ", currency='" + getCurrency() + "'" +
            "}";
    }
}
