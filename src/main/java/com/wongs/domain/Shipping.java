package com.wongs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.wongs.domain.enumeration.CurrencyType;

import com.wongs.domain.enumeration.ShippingStatus;

/**
 * A Shipping.
 */
@Entity
@Table(name = "shipping")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "shipping")
public class Shipping implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price", precision=10, scale=2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @Column(name = "jhi_date")
    private ZonedDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ShippingStatus status;

    @OneToOne
    @JoinColumn(unique = true)
    private OrderShop shop;

    @OneToMany(mappedBy = "shipping")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ShippingStatusHistory> statusHistories = new HashSet<>();

    @ManyToOne
    private ShippingType type;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Shipping price(BigDecimal price) {
        this.price = price;
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public Shipping currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public Shipping date(ZonedDateTime date) {
        this.date = date;
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public ShippingStatus getStatus() {
        return status;
    }

    public Shipping status(ShippingStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ShippingStatus status) {
        this.status = status;
    }

    public OrderShop getShop() {
        return shop;
    }

    public Shipping shop(OrderShop orderShop) {
        this.shop = orderShop;
        return this;
    }

    public void setShop(OrderShop orderShop) {
        this.shop = orderShop;
    }

    public Set<ShippingStatusHistory> getStatusHistories() {
        return statusHistories;
    }

    public Shipping statusHistories(Set<ShippingStatusHistory> shippingStatusHistories) {
        this.statusHistories = shippingStatusHistories;
        return this;
    }

    public Shipping addStatusHistory(ShippingStatusHistory shippingStatusHistory) {
        this.statusHistories.add(shippingStatusHistory);
        shippingStatusHistory.setShipping(this);
        return this;
    }

    public Shipping removeStatusHistory(ShippingStatusHistory shippingStatusHistory) {
        this.statusHistories.remove(shippingStatusHistory);
        shippingStatusHistory.setShipping(null);
        return this;
    }

    public void setStatusHistories(Set<ShippingStatusHistory> shippingStatusHistories) {
        this.statusHistories = shippingStatusHistories;
    }

    public ShippingType getType() {
        return type;
    }

    public Shipping type(ShippingType shippingType) {
        this.type = shippingType;
        return this;
    }

    public void setType(ShippingType shippingType) {
        this.type = shippingType;
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
        Shipping shipping = (Shipping) o;
        if (shipping.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shipping.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Shipping{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", currency='" + getCurrency() + "'" +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
