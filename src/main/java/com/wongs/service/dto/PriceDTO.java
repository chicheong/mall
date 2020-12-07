package com.wongs.service.dto;

import java.time.ZonedDateTime;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.Price;
import com.wongs.domain.ProductItem;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the {@link com.wongs.domain.Price} entity.
 */
public class PriceDTO implements Serializable {
    
    private Long id;
    
    private String tempId;

    private ZonedDateTime from;

    private ZonedDateTime to;

    private BigDecimal price;

    private CurrencyType currency;

    private ProductItem item;

    public PriceDTO() {
        // Empty constructor needed for Jackson.
	}
    
    public PriceDTO(Price price) {
		this.id = price.getId();
		this.from = price.getFrom();
		this.to = price.getTo();
		this.price = price.getPrice();
		this.currency = price.getCurrency();
		this.item = price.getItem();
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

	public String getTempId() {
		return tempId;
	}

	public void setTempId(String tempId) {
		this.tempId = tempId;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public ProductItem getItem() {
		return item;
	}

	public void setItem(ProductItem item) {
		this.item = item;
	}

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PriceDTO priceDTO = (PriceDTO) o;
        if (priceDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), priceDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PriceDTO{" +
            "id=" + getId() +
            ", from='" + getFrom() + "'" +
            ", to='" + getTo() + "'" +
            ", price=" + getPrice() +
            ", currency='" + getCurrency() + "'" +
            ", item=" + getItem() +
            "}";
    }
}
