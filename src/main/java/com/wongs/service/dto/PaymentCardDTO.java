package com.wongs.service.dto;

import java.io.Serializable;
import java.util.Objects;

import com.wongs.domain.Payment;
import com.wongs.domain.PaymentCard;

/**
 * A DTO for the {@link com.wongs.domain.PaymentCard} entity.
 */
public class PaymentCardDTO implements Serializable {
    
    private Long id;

    private String holderName;

    private String cardNumber;

    private String expirationMonth;

    private String expirationYear;

    private String cvc;

    private Payment payment;

    public PaymentCardDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public PaymentCardDTO(PaymentCard paymentCard) {
        this.id = paymentCard.getId();
    	this.holderName = paymentCard.getHolderName();
    	this.cardNumber = paymentCard.getCardNumber();
    	this.expirationMonth = paymentCard.getExpirationMonth();
    	this.expirationYear = paymentCard.getExpirationYear();
    	this.cvc = paymentCard.getCvc();
//    	this.payment = paymentCard.getPayment();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getExpirationMonth() {
        return expirationMonth;
    }

    public void setExpirationMonth(String expirationMonth) {
        this.expirationMonth = expirationMonth;
    }

    public String getExpirationYear() {
        return expirationYear;
    }

    public void setExpirationYear(String expirationYear) {
        this.expirationYear = expirationYear;
    }

    public String getCvc() {
        return cvc;
    }

    public void setCvc(String cvc) {
        this.cvc = cvc;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PaymentCardDTO paymentCardDTO = (PaymentCardDTO) o;
        if (paymentCardDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentCardDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentCardDTO{" +
            "id=" + getId() +
            ", holderName='" + getHolderName() + "'" +
            ", cardNumber='" + getCardNumber() + "'" +
            ", expirationMonth='" + getExpirationMonth() + "'" +
            ", expirationYear='" + getExpirationYear() + "'" +
            ", cvc='" + getCvc() + "'" +
            ", payment=" + getPayment() +
            "}";
    }
}
