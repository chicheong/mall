package com.wongs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.wongs.domain.enumeration.CurrencyType;

import com.wongs.domain.enumeration.OrderStatus;

/**
 * A MyOrder.
 */
@Entity
@Table(name = "my_order")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "myorder")
public class MyOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total", precision = 21, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @Column(name = "remark")
    private String remark;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @OneToOne
    @JoinColumn(unique = true)
    private Contact shipping;

    @OneToOne
    @JoinColumn(unique = true)
    private Contact billing;

    @OneToMany(mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<OrderShop> shops = new HashSet<>();

    @OneToMany(mappedBy = "order")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<OrderStatusHistory> statusHistories = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("myOrders")
    private MyAccount account;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Contact getShipping() {
        return shipping;
    }

    public MyOrder shipping(Contact contact) {
        this.shipping = contact;
        return this;
    }

    public void setShipping(Contact contact) {
        this.shipping = contact;
    }

    public Contact getBilling() {
        return billing;
    }

    public MyOrder billing(Contact contact) {
        this.billing = contact;
        return this;
    }

    public void setBilling(Contact contact) {
        this.billing = contact;
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
        if (!(o instanceof MyOrder)) {
            return false;
        }
		MyOrder myOrder = (MyOrder) o;
        if (myOrder.getId() == null || getId() == null) {
            return false;
        }
        boolean match = false;
		for (OrderShop shop : getShops()) {
			match = false;
			for (OrderShop oShop : myOrder.getShops()) {
				if (oShop.equals(shop)) {
					match = true;
					break;
				}
			}
			if (!match)
				return false;
		}
		for (OrderShop shop : myOrder.getShops()) {
			match = false;
			for (OrderShop oShop : getShops()) {
				if (oShop.equals(shop)) {
					match = true;
					break;
				}
			}
			if (!match)
				return false;
		}
        return id != null && id.equals(((MyOrder) o).id) && 
        		(getTotal().compareTo(myOrder.getTotal()) == 0) &&
        		Objects.equals(getCurrency(), myOrder.getCurrency()) &&
        		// Objects.equals(getRemark(), myOrder.getRemark()) &&
        		Objects.equals(getStatus(), myOrder.getStatus()) &&
        		(getShipping() == null && myOrder.getShipping() == null?true:Objects.equals(getShipping().getId(), myOrder.getShipping().getId())) &&
        		(getBilling() == null && myOrder.getBilling() == null?true:Objects.equals(getBilling().getId(), myOrder.getBilling().getId()));
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "MyOrder{" +
            "id=" + getId() +
            ", total=" + getTotal() +
            ", currency='" + getCurrency() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
