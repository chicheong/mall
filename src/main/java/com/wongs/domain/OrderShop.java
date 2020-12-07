package com.wongs.domain;

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

/**
 * A OrderShop.
 */
@Entity
@Table(name = "order_shop")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "ordershop")
public class OrderShop implements Serializable {

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

    @OneToOne
    @JoinColumn(unique = true)
    private Shipping shipping;

    @OneToOne
    @JoinColumn(unique = true)
    private Shop shop;

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<OrderItem> items = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("shops")
    private MyOrder order;

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

    public OrderShop total(BigDecimal total) {
        this.total = total;
        return this;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public OrderShop currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public String getRemark() {
        return remark;
    }

    public OrderShop remark(String remark) {
        this.remark = remark;
        return this;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Shipping getShipping() {
        return shipping;
    }

    public OrderShop shipping(Shipping shipping) {
        this.shipping = shipping;
        return this;
    }

    public void setShipping(Shipping shipping) {
        this.shipping = shipping;
    }

    public Shop getShop() {
        return shop;
    }

    public OrderShop shop(Shop shop) {
        this.shop = shop;
        return this;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Set<OrderItem> getItems() {
        return items;
    }

    public OrderShop items(Set<OrderItem> orderItems) {
        this.items = orderItems;
        return this;
    }

    public OrderShop addItem(OrderItem orderItem) {
        this.items.add(orderItem);
        orderItem.setShop(this);
        return this;
    }

    public OrderShop removeItem(OrderItem orderItem) {
        this.items.remove(orderItem);
        orderItem.setShop(null);
        return this;
    }

    public void setItems(Set<OrderItem> orderItems) {
        this.items = orderItems;
    }

    public MyOrder getOrder() {
        return order;
    }

    public OrderShop order(MyOrder myOrder) {
        this.order = myOrder;
        return this;
    }

    public void setOrder(MyOrder myOrder) {
        this.order = myOrder;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrderShop)) {
            return false;
        }
		OrderShop orderShop = (OrderShop) o;
        if (orderShop.getId() == null || getId() == null) {
            return false;
        }
        boolean match = false;
        for (OrderItem item : getItems()) {
        	match = false;
        	for (OrderItem oItem : orderShop.getItems()) {
        		if (oItem.equals(item)) {
        			match = true;
        			break;
        		}
        	}
        	if (!match)
        		return false;
        }
        for (OrderItem item : orderShop.getItems()) {
        	match = false;
        	for (OrderItem oItem : getItems()) {
        		if (oItem.equals(item)) {
        			match = true;
        			break;
        		}
        	}
        	if (!match)
        		return false;
        }
        return id != null && id.equals(((OrderShop) o).id) &&
        		(getTotal().compareTo(orderShop.getTotal()) == 0) &&
        		Objects.equals(getCurrency(), orderShop.getCurrency()) &&
        		Objects.equals(getRemark(), orderShop.getRemark()) &&
        		(getShipping() == null && orderShop.getShipping() == null?true:Objects.equals(getShipping().getId(), orderShop.getShipping().getId()));
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "OrderShop{" +
            "id=" + getId() +
            ", total=" + getTotal() +
            ", currency='" + getCurrency() + "'" +
            ", remark='" + getRemark() + "'" +
            "}";
    }
}
