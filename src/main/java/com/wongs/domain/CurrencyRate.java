package com.wongs.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

import com.wongs.domain.enumeration.CurrencyType;

/**
 * A CurrencyRate.
 */
@Entity
@Table(name = "currency_rate")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "currencyrate")
public class CurrencyRate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jhi_from")
    private ZonedDateTime from;

    @Column(name = "jhi_to")
    private ZonedDateTime to;

    @Column(name = "rate", precision = 21, scale = 2)
    private BigDecimal rate;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_currency")
    private CurrencyType sourceCurrency;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_currency")
    private CurrencyType targetCurrency;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFrom() {
        return from;
    }

    public CurrencyRate from(ZonedDateTime from) {
        this.from = from;
        return this;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }

    public ZonedDateTime getTo() {
        return to;
    }

    public CurrencyRate to(ZonedDateTime to) {
        this.to = to;
        return this;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public CurrencyRate rate(BigDecimal rate) {
        this.rate = rate;
        return this;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public CurrencyType getSourceCurrency() {
        return sourceCurrency;
    }

    public CurrencyRate sourceCurrency(CurrencyType sourceCurrency) {
        this.sourceCurrency = sourceCurrency;
        return this;
    }

    public void setSourceCurrency(CurrencyType sourceCurrency) {
        this.sourceCurrency = sourceCurrency;
    }

    public CurrencyType getTargetCurrency() {
        return targetCurrency;
    }

    public CurrencyRate targetCurrency(CurrencyType targetCurrency) {
        this.targetCurrency = targetCurrency;
        return this;
    }

    public void setTargetCurrency(CurrencyType targetCurrency) {
        this.targetCurrency = targetCurrency;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CurrencyRate)) {
            return false;
        }
        return id != null && id.equals(((CurrencyRate) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "CurrencyRate{" +
            "id=" + getId() +
            ", from='" + getFrom() + "'" +
            ", to='" + getTo() + "'" +
            ", rate=" + getRate() +
            ", sourceCurrency='" + getSourceCurrency() + "'" +
            ", targetCurrency='" + getTargetCurrency() + "'" +
            "}";
    }
}
