package com.wongs.service.dto;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the OrderItem entity.
 */
public class OrderItemDTO implements Serializable {

    private Long id;

    private Integer quantity;

    private BigDecimal price;

    private CurrencyType currency;


    private Long shopId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long orderShopId) {
        this.shopId = orderShopId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        OrderItemDTO orderItemDTO = (OrderItemDTO) o;
        if (orderItemDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), orderItemDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OrderItemDTO{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", price=" + getPrice() +
            ", currency='" + getCurrency() + "'" +
            ", shop=" + getShopId() +
            "}";
    }
}
