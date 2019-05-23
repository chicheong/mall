package com.wongs.service.dto;
import java.time.ZonedDateTime;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.ShippingStatus;

/**
 * A DTO for the Shipping entity.
 */
public class ShippingDTO implements Serializable {

    private Long id;

    private BigDecimal price;

    private CurrencyType currency;

    private ZonedDateTime date;

    private ShippingStatus status;


    private Long typeId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public ShippingStatus getStatus() {
        return status;
    }

    public void setStatus(ShippingStatus status) {
        this.status = status;
    }

    public Long getTypeId() {
        return typeId;
    }

    public void setTypeId(Long shippingTypeId) {
        this.typeId = shippingTypeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ShippingDTO shippingDTO = (ShippingDTO) o;
        if (shippingDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shippingDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShippingDTO{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", currency='" + getCurrency() + "'" +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", type=" + getTypeId() +
            "}";
    }
}
