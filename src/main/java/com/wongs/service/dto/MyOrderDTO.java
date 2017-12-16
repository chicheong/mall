package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.OrderStatus;

/**
 * A DTO for the MyOrder entity.
 */
public class MyOrderDTO implements Serializable {

    private Long id;

    private BigDecimal total;

    private CurrencyType currency;

    private String remark;

    private OrderStatus status;

    private Long accountId;

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

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long myAccountId) {
        this.accountId = myAccountId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        MyOrderDTO myOrderDTO = (MyOrderDTO) o;
        if(myOrderDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), myOrderDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MyOrderDTO{" +
            "id=" + getId() +
            ", total=" + getTotal() +
            ", currency='" + getCurrency() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
