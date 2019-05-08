package com.wongs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

import com.wongs.domain.enumeration.OrderStatus;

/**
 * A MyOrder.
 */
@Entity
@Table(name = "my_order")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "myorder")
public class MyOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receiver")
    private String receiver;

    @Column(name = "total", precision=10, scale=2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @Column(name = "contact_num")
    private String contactNum;

    @Column(name = "email")
    private String email;

    @Column(name = "remark")
    private String remark;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @OneToOne
    @JoinColumn(unique = true)
    private Address shippingAddress;

    @OneToOne
    @JoinColumn(unique = true)
    private Address billingAddress;

    @OneToMany(mappedBy = "order")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<OrderShop> shops = new HashSet<>();

    @OneToMany(mappedBy = "order")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<OrderStatusHistory> statusHistories = new HashSet<>();

    @ManyToOne
    private MyAccount account;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceiver() {
        return receiver;
    }

    public MyOrder receiver(String receiver) {
        this.receiver = receiver;
        return this;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public MyOrder total(BigDecimal total) {
        this.total = total;
        return this;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public MyOrder currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public String getContactNum() {
        return contactNum;
    }

    public MyOrder contactNum(String contactNum) {
        this.contactNum = contactNum;
        return this;
    }

    public void setContactNum(String contactNum) {
        this.contactNum = contactNum;
    }

    public String getEmail() {
        return email;
    }

    public MyOrder email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRemark() {
        return remark;
    }

    public MyOrder remark(String remark) {
        this.remark = remark;
        return this;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public MyOrder status(OrderStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public MyOrder shippingAddress(Address address) {
        this.shippingAddress = address;
        return this;
    }

    public void setShippingAddress(Address address) {
        this.shippingAddress = address;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public MyOrder billingAddress(Address address) {
        this.billingAddress = address;
        return this;
    }

    public void setBillingAddress(Address address) {
        this.billingAddress = address;
    }

    public Set<OrderShop> getShops() {
        return shops;
    }

    public MyOrder shops(Set<OrderShop> orderShops) {
        this.shops = orderShops;
        return this;
    }

    public MyOrder addShop(OrderShop orderShop) {
        this.shops.add(orderShop);
        orderShop.setOrder(this);
        return this;
    }

    public MyOrder removeShop(OrderShop orderShop) {
        this.shops.remove(orderShop);
        orderShop.setOrder(null);
        return this;
    }

    public void setShops(Set<OrderShop> orderShops) {
        this.shops = orderShops;
    }

    public Set<OrderStatusHistory> getStatusHistories() {
        return statusHistories;
    }

    public MyOrder statusHistories(Set<OrderStatusHistory> orderStatusHistories) {
        this.statusHistories = orderStatusHistories;
        return this;
    }

    public MyOrder addStatusHistory(OrderStatusHistory orderStatusHistory) {
        this.statusHistories.add(orderStatusHistory);
        orderStatusHistory.setOrder(this);
        return this;
    }

    public MyOrder removeStatusHistory(OrderStatusHistory orderStatusHistory) {
        this.statusHistories.remove(orderStatusHistory);
        orderStatusHistory.setOrder(null);
        return this;
    }

    public void setStatusHistories(Set<OrderStatusHistory> orderStatusHistories) {
        this.statusHistories = orderStatusHistories;
    }

    public MyAccount getAccount() {
        return account;
    }

    public MyOrder account(MyAccount myAccount) {
        this.account = myAccount;
        return this;
    }

    public void setAccount(MyAccount myAccount) {
        this.account = myAccount;
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
        MyOrder myOrder = (MyOrder) o;
        if (myOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), myOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MyOrder{" +
            "id=" + getId() +
            ", receiver='" + getReceiver() + "'" +
            ", total=" + getTotal() +
            ", currency='" + getCurrency() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", email='" + getEmail() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
