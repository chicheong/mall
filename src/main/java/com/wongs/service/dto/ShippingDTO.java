package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.wongs.domain.OrderShop;
import com.wongs.domain.Shipping;
import com.wongs.domain.ShippingStatusHistory;
import com.wongs.domain.ShippingType;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.ShippingStatus;

/**
 * A DTO for the {@link com.wongs.domain.Shipping} entity.
 */
public class ShippingDTO implements Serializable {
    
    private Long id;

    private BigDecimal price;

    private CurrencyType currency;

    private ZonedDateTime date;

    private ShippingStatus status;

    private OrderShop orderShop;

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
		this.status = shipping.getStatus();
//		this.orderShop = shipping.getOrderShop();
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

	public ShippingStatus getStatus() {
		return status;
	}

	public void setStatus(ShippingStatus status) {
		this.status = status;
	}

	public OrderShop getOrderShop() {
		return orderShop;
	}

	public void setOrderShop(OrderShop orderShop) {
		this.orderShop = orderShop;
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
            ", type=" + getType() +
            "}";
    }
}
