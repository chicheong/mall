package com.wongs.service.dto;

import java.io.Serializable;
import java.util.Objects;

import com.wongs.domain.Card;
import com.wongs.domain.MyAccount;

/**
 * A DTO for the {@link com.wongs.domain.Card} entity.
 */
public class CardDTO implements Serializable {
    
    private Long id;

    private String holderName;

    private String cardNumber;

    private String expirationMonth;

    private String expirationYear;

    private String cvc;

    private MyAccount account;

    public CardDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public CardDTO(Card card) {
        this.id = card.getId();
    	this.holderName = card.getHolderName();
    	this.cardNumber = card.getCardNumber();
    	this.expirationMonth = card.getExpirationMonth();
    	this.expirationYear = card.getExpirationYear();
    	this.cvc = card.getCvc();
    	this.account = card.getAccount();
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

    public MyAccount getAccount() {
		return account;
	}

	public void setAccount(MyAccount account) {
		this.account = account;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CardDTO cardDTO = (CardDTO) o;
        if (cardDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), cardDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CardDTO{" +
            "id=" + getId() +
            ", holderName='" + getHolderName() + "'" +
            ", cardNumber='" + getCardNumber() + "'" +
            ", expirationMonth='" + getExpirationMonth() + "'" +
            ", expirationYear='" + getExpirationYear() + "'" +
            ", cvc='" + getCvc() + "'" +
            ", account=" + getAccount() +
            "}";
    }
}
