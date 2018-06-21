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

    @Column(name = "receiver")
    private String receiver;

    @Column(name = "contact_num")
    private String contactNum;

    @Column(name = "email")
    private String email;

    @Column(name = "remark")
    private String remark;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ShippingStatus status;

    @OneToOne
    @JoinColumn(unique = true)
    private MyOrder order;

    @OneToOne
    @JoinColumn(unique = true)
    private Address shippingAddress;

    @OneToOne
    @JoinColumn(unique = true)
    private Address billingAddress;

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

    public String getReceiver() {
        return receiver;
    }

    public Shipping receiver(String receiver) {
        this.receiver = receiver;
        return this;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getContactNum() {
        return contactNum;
    }

    public Shipping contactNum(String contactNum) {
        this.contactNum = contactNum;
        return this;
    }

    public void setContactNum(String contactNum) {
        this.contactNum = contactNum;
    }

    public String getEmail() {
        return email;
    }

    public Shipping email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRemark() {
        return remark;
    }

    public Shipping remark(String remark) {
        this.remark = remark;
        return this;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

    public MyOrder getOrder() {
        return order;
    }

    public Shipping order(MyOrder myOrder) {
        this.order = myOrder;
        return this;
    }

    public void setOrder(MyOrder myOrder) {
        this.order = myOrder;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public Shipping shippingAddress(Address address) {
        this.shippingAddress = address;
        return this;
    }

    public void setShippingAddress(Address address) {
        this.shippingAddress = address;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public Shipping billingAddress(Address address) {
        this.billingAddress = address;
        return this;
    }

    public void setBillingAddress(Address address) {
        this.billingAddress = address;
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
            ", receiver='" + getReceiver() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", email='" + getEmail() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}