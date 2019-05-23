package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.enumeration.OrderStatus;

/**
 * A OrderStatusHistory.
 */
@Entity
@Table(name = "order_status_history")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "orderstatushistory")
public class OrderStatusHistory implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "effective_date")
    private ZonedDateTime effectiveDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @ManyToOne
    @JsonIgnoreProperties("statusHistories")
    private MyOrder order;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getEffectiveDate() {
        return effectiveDate;
    }

    public OrderStatusHistory effectiveDate(ZonedDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
        return this;
    }

    public void setEffectiveDate(ZonedDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public OrderStatusHistory status(OrderStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public MyOrder getOrder() {
        return order;
    }

    public OrderStatusHistory order(MyOrder myOrder) {
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
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        OrderStatusHistory orderStatusHistory = (OrderStatusHistory) o;
        if (orderStatusHistory.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), orderStatusHistory.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OrderStatusHistory{" +
            "id=" + getId() +
            ", effectiveDate='" + getEffectiveDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
