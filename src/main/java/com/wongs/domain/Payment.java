package com.wongs.domain;

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

import com.wongs.domain.enumeration.PaymentType;

import com.wongs.domain.enumeration.PaymentStatus;

/**
 * A Payment.
 */
@Entity
@Table(name = "payment")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "payment")
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount", precision = 21, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private PaymentType type;

    @Column(name = "remark")
    private String remark;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;

    @OneToOne
    @JoinColumn(unique = false) //@JsonIgnore
    private MyOrder order;

    @OneToMany(mappedBy = "payment")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<PaymentStatusHistory> statusHistories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Payment amount(BigDecimal amount) {
        this.amount = amount;
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public Payment currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public PaymentType getType() {
        return type;
    }

    public Payment type(PaymentType type) {
        this.type = type;
        return this;
    }

    public void setType(PaymentType type) {
        this.type = type;
    }

    public String getRemark() {
        return remark;
    }

    public Payment remark(String remark) {
        this.remark = remark;
        return this;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public Payment status(PaymentStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public MyOrder getOrder() {
        return order;
    }

    public Payment order(MyOrder myOrder) {
        this.order = myOrder;
        return this;
    }

    public void setOrder(MyOrder myOrder) {
        this.order = myOrder;
    }

    public Set<PaymentStatusHistory> getStatusHistories() {
        return statusHistories;
    }

    public Payment statusHistories(Set<PaymentStatusHistory> paymentStatusHistories) {
        this.statusHistories = paymentStatusHistories;
        return this;
    }

    public Payment addStatusHistory(PaymentStatusHistory paymentStatusHistory) {
        this.statusHistories.add(paymentStatusHistory);
        paymentStatusHistory.setPayment(this);
        return this;
    }

    public Payment removeStatusHistory(PaymentStatusHistory paymentStatusHistory) {
        this.statusHistories.remove(paymentStatusHistory);
        paymentStatusHistory.setPayment(null);
        return this;
    }

    public void setStatusHistories(Set<PaymentStatusHistory> paymentStatusHistories) {
        this.statusHistories = paymentStatusHistories;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Payment)) {
            return false;
        }
        return id != null && id.equals(((Payment) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", currency='" + getCurrency() + "'" +
            ", type='" + getType() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
