package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import com.wongs.domain.Address;
import com.wongs.domain.MyOrder;
import com.wongs.domain.OrderItem;
import com.wongs.domain.OrderShop;
import com.wongs.domain.OrderStatusHistory;
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

    private Address shippingAddress;

    private Address billingAddress;
    
    private Set<OrderShopDTO> shops = new HashSet<>();

    private Set<OrderStatusHistory> statusHistories = new HashSet<>();

    private Long accountId;
    
    private PaymentDTO payment;

    public MyOrderDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public MyOrderDTO(MyOrder myOrder) {
        this.id = myOrder.getId();
        this.receiver = myOrder.getReceiver();
    	this.total = myOrder.getTotal();
    	this.currency = myOrder.getCurrency();
    	this.contactNum = myOrder.getContactNum();
    	this.email = myOrder.getEmail();
    	this.remark = myOrder.getRemark();
    	this.status = myOrder.getStatus();
		this.shippingAddress = myOrder.getShippingAddress();
		this.billingAddress = myOrder.getBillingAddress();
    	
//    	this.shops = new HashSet<OrderShopDTO>();
//    	myOrder.getShops().forEach(shop -> {
//    		OrderShop orderShop = new OrderShop();
//    		orderShop.setCurrency(shop.getCurrency());
//    		orderShop.setId(shop.getId());
//    		orderShop.setOrder(shop.getOrder());
//    		orderShop.setRemark(shop.getRemark());
//    		orderShop.setShipping(shop.getShipping());
//    		orderShop.setShop(shop.getShop());
//    		orderShop.setTotal(shop.getTotal());
//    		orderShop.setItems(new HashSet<OrderItem>());
//    		shop.getItems().forEach(item -> {
//    			OrderItem orderItem = new OrderItem();
//    			orderItem.setCurrency(item.getCurrency());
//    			orderItem.setId(item.getId());
//    			orderItem.setPrice(item.getPrice());
//    			orderItem.setProductItem(item.getProductItem());
//    			orderItem.setQuantity(item.getQuantity());
//    			orderItem.setShop(item.getShop());
//    			orderShop.getItems().add(orderItem);
//    		});
//    		this.shops.add(orderShop);
//    	});
    	this.statusHistories = myOrder.getStatusHistories();
    	this.accountId = Optional.of(myOrder.getAccount()).get().getId();
    }

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

	public Address getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(Address shippingAddress) {
		this.shippingAddress = shippingAddress;
	}

	public Address getBillingAddress() {
		return billingAddress;
	}

	public void setBillingAddress(Address billingAddress) {
		this.billingAddress = billingAddress;
	}

	public Set<OrderShopDTO> getShops() {
		return shops;
	}

	public void setShops(Set<OrderShopDTO> shops) {
		this.shops = shops;
	}

	public Set<OrderStatusHistory> getStatusHistories() {
		return statusHistories;
	}

	public void setStatusHistories(Set<OrderStatusHistory> statusHistories) {
		this.statusHistories = statusHistories;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public PaymentDTO getPayment() {
		return payment;
	}

	public void setPayment(PaymentDTO payment) {
		this.payment = payment;
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
            ", receiver='" + getReceiver() + "'" +
            ", total=" + getTotal() +
            ", currency='" + getCurrency() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", email='" + getEmail() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
