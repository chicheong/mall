package com.wongs.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.CurrencyRate;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the {@link com.wongs.domain.CurrencyRate} entity.
 */
public class CurrencyRateDTO implements Serializable {
    
    private Long id;

    private ZonedDateTime from;

    private ZonedDateTime to;

    private BigDecimal rate;

    private CurrencyType sourceCurrency;

    private CurrencyType targetCurrency;

    public CurrencyRateDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public CurrencyRateDTO(CurrencyRate currencyRate) {
        this.id = currencyRate.getId();
    	this.from = currencyRate.getFrom();
    	this.to = currencyRate.getTo();
    	this.rate = currencyRate.getRate();
    	this.sourceCurrency = currencyRate.getSourceCurrency();
    	this.targetCurrency = currencyRate.getTargetCurrency();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFrom() {
        return from;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }

    public ZonedDateTime getTo() {
        return to;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public CurrencyType getSourceCurrency() {
        return sourceCurrency;
    }

    public void setSourceCurrency(CurrencyType sourceCurrency) {
        this.sourceCurrency = sourceCurrency;
    }

    public CurrencyType getTargetCurrency() {
        return targetCurrency;
    }

    public void setTargetCurrency(CurrencyType targetCurrency) {
        this.targetCurrency = targetCurrency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CurrencyRateDTO currencyRateDTO = (CurrencyRateDTO) o;
        if (currencyRateDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), currencyRateDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CurrencyRateDTO{" +
            "id=" + getId() +
            ", from='" + getFrom() + "'" +
            ", to='" + getTo() + "'" +
            ", rate=" + getRate() +
            ", sourceCurrency='" + getSourceCurrency() + "'" +
            ", targetCurrency='" + getTargetCurrency() + "'" +
            "}";
    }
}
