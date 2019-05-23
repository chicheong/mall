package com.wongs.service.dto;
import java.time.ZonedDateTime;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the Price entity.
 */
public class PriceDTO implements Serializable {

    private Long id;

    private ZonedDateTime from;

    private ZonedDateTime to;

    private BigDecimal price;

    private CurrencyType currency;


    private Long itemId;

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

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long productItemId) {
        this.itemId = productItemId;
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
            ", item=" + getItemId() +
            "}";
    }
}
