package com.wongs.service.dto;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the OrderShop entity.
 */
public class OrderShopDTO implements Serializable {

    private Long id;

    private BigDecimal total;

    private CurrencyType currency;

    private String remark;


    private Long shippingId;

    private Long shopId;

    private Long orderId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Long getShippingId() {
        return shippingId;
    }

    public void setShippingId(Long shippingId) {
        this.shippingId = shippingId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long myOrderId) {
        this.orderId = myOrderId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        OrderShopDTO orderShopDTO = (OrderShopDTO) o;
        if (orderShopDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), orderShopDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OrderShopDTO{" +
            "id=" + getId() +
            ", total=" + getTotal() +
            ", currency='" + getCurrency() + "'" +
            ", remark='" + getRemark() + "'" +
            ", shipping=" + getShippingId() +
            ", shop=" + getShopId() +
            ", order=" + getOrderId() +
            "}";
    }
}
