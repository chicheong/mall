package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.wongs.domain.Address;
import com.wongs.domain.MyOrder;
import com.wongs.domain.Shipping;
import com.wongs.domain.ShippingStatusHistory;
import com.wongs.domain.ShippingType;
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

    private String receiver;

    private String contactNum;

    private String email;

    private String remark;

    private ShippingStatus status;

    private MyOrder order;

    private Address shippingAddress;

    private Address billingAddress;

    private ShippingType type;

    private Set<ShippingStatusHistory> statusHistories = new HashSet<>();
    
    public ShippingDTO() {
        // Empty constructor needed for Jackson.
	}
    
    public ShippingDTO(Shipping shipping) {
		this.id = shipping.getId();
		this.price = shipping.getPrice();
		this.currency = shipping.getCurrency();
		this.date = shipping.getDate();
		this.receiver = shipping.getReceiver();
		this.contactNum = shipping.getContactNum();
		this.email = shipping.getEmail();
		this.remark = shipping.getRemark();
		this.status = shipping.getStatus();
		this.order = shipping.getOrder();
		this.shippingAddress = shipping.getShippingAddress();
		this.billingAddress = shipping.getBillingAddress();
		this.type = shipping.getType();
		this.statusHistories = shipping.getStatusHistories();
	}
    
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

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
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

    public ShippingStatus getStatus() {
        return status;
    }

    public void setStatus(ShippingStatus status) {
        this.status = status;
    }

    public MyOrder getOrder() {
		return order;
	}

	public void setOrder(MyOrder order) {
		this.order = order;
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

	public ShippingType getType() {
		return type;
	}

	public void setType(ShippingType type) {
		this.type = type;
	}

	public Set<ShippingStatusHistory> getStatusHistories() {
		return statusHistories;
	}

	public void setStatusHistories(Set<ShippingStatusHistory> statusHistories) {
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

        ShippingDTO shippingDTO = (ShippingDTO) o;
        if(shippingDTO.getId() == null || getId() == null) {
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
            ", receiver='" + getReceiver() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", email='" + getEmail() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
