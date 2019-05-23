package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.enumeration.PaymentStatus;

/**
 * A PaymentStatusHistory.
 */
@Entity
@Table(name = "payment_status_history")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "paymentstatushistory")
public class PaymentStatusHistory implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "effective_date")
    private ZonedDateTime effectiveDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;

    @ManyToOne
    @JsonIgnoreProperties("statusHistories")
    private Payment payment;

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

    public PaymentStatusHistory effectiveDate(ZonedDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
        return this;
    }

    public void setEffectiveDate(ZonedDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public PaymentStatusHistory status(PaymentStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public Payment getPayment() {
        return payment;
    }

    public PaymentStatusHistory payment(Payment payment) {
        this.payment = payment;
        return this;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
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
        PaymentStatusHistory paymentStatusHistory = (PaymentStatusHistory) o;
        if (paymentStatusHistory.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentStatusHistory.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentStatusHistory{" +
            "id=" + getId() +
            ", effectiveDate='" + getEffectiveDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
