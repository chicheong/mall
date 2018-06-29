package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import com.wongs.domain.MyOrder;
import com.wongs.domain.OrderItem;
import com.wongs.domain.OrderStatusHistory;
import com.wongs.domain.Shipping;
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
    
    private ShippingDTO shipping;
    private PaymentDTO payment;
    
    private Set<OrderItem> items = new HashSet<>();
    private Set<OrderStatusHistory> statusHistories = new HashSet<>();

    public MyOrderDTO() {
        // Empty constructor needed for Jackson.
    }

    public MyOrderDTO(MyOrder myOrder) {
        this.id = myOrder.getId();
    	this.total = myOrder.getTotal();
    	this.currency = myOrder.getCurrency();
    	this.remark = myOrder.getRemark();
    	this.status = myOrder.getStatus();
    	
    	this.items = myOrder.getItems();
    	this.statusHistories = myOrder.getStatusHistories();
    	this.accountId = Optional.of(myOrder.getAccount()).get().getId();
    }
    
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

	public ShippingDTO getShipping() {
		return shipping;
	}

	public void setShipping(ShippingDTO shipping) {
		this.shipping = shipping;
	}

	public PaymentDTO getPayment() {
		return payment;
	}

	public void setPayment(PaymentDTO payment) {
		this.payment = payment;
	}

	public Set<OrderItem> getItems() {
		return items;
	}

	public void setItems(Set<OrderItem> items) {
		this.items = items;
	}

	public Set<OrderStatusHistory> getStatusHistories() {
		return statusHistories;
	}

	public void setStatusHistories(Set<OrderStatusHistory> statusHistories) {
		this.statusHistories = statusHistories;
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
