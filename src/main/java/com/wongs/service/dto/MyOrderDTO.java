package com.wongs.service.dto;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.OrderStatus;

/**
 * A DTO for the MyOrder entity.
 */
public class MyOrderDTO implements Serializable {

    private Long id;

    private String receiver;

    private BigDecimal total;

    private CurrencyType currency;

    private String contactNum;

    private String email;

    private String remark;

    private OrderStatus status;


    private Long shippingAddressId;

    private Long billingAddressId;

    private Long accountId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
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

    public String getContactNum() {
        return contactNum;
    }

    public void setContactNum(String contactNum) {
        this.contactNum = contactNum;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Long getShippingAddressId() {
        return shippingAddressId;
    }

    public void setShippingAddressId(Long addressId) {
        this.shippingAddressId = addressId;
    }

    public Long getBillingAddressId() {
        return billingAddressId;
    }

    public void setBillingAddressId(Long addressId) {
        this.billingAddressId = addressId;
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
        if (myOrderDTO.getId() == null || getId() == null) {
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
            ", receiver='" + getReceiver() + "'" +
            ", total=" + getTotal() +
            ", currency='" + getCurrency() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", email='" + getEmail() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            ", shippingAddress=" + getShippingAddressId() +
            ", billingAddress=" + getBillingAddressId() +
            ", account=" + getAccountId() +
            "}";
    }
}
