package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A PaymentCard.
 */
@Entity
@Table(name = "payment_card")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "paymentcard")
public class PaymentCard implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "holder_name")
    private String holderName;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "expiration_month")
    private String expirationMonth;

    @Column(name = "expiration_year")
    private String expirationYear;

    @Column(name = "cvc")
    private String cvc;

    @OneToOne(mappedBy = "paymentCard")
    @JsonIgnore
    private Payment payment;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHolderName() {
        return holderName;
    }

    public PaymentCard holderName(String holderName) {
        this.holderName = holderName;
        return this;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public PaymentCard cardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
        return this;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpirationMonth() {
        return expirationMonth;
    }

    public PaymentCard expirationMonth(String expirationMonth) {
        this.expirationMonth = expirationMonth;
        return this;
    }

    public void setExpirationMonth(String expirationMonth) {
        this.expirationMonth = expirationMonth;
    }

    public String getExpirationYear() {
        return expirationYear;
    }

    public PaymentCard expirationYear(String expirationYear) {
        this.expirationYear = expirationYear;
        return this;
    }

    public void setExpirationYear(String expirationYear) {
        this.expirationYear = expirationYear;
    }

    public String getCvc() {
        return cvc;
    }

    public PaymentCard cvc(String cvc) {
        this.cvc = cvc;
        return this;
    }

    public void setCvc(String cvc) {
        this.cvc = cvc;
    }

    public Payment getPayment() {
        return payment;
    }

    public PaymentCard payment(Payment payment) {
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
        PaymentCard paymentCard = (PaymentCard) o;
        if (paymentCard.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentCard.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentCard{" +
            "id=" + getId() +
            ", holderName='" + getHolderName() + "'" +
            ", cardNumber='" + getCardNumber() + "'" +
            ", expirationMonth='" + getExpirationMonth() + "'" +
            ", expirationYear='" + getExpirationYear() + "'" +
            ", cvc='" + getCvc() + "'" +
            "}";
    }
}
