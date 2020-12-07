package com.wongs.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.wongs.domain.MyOrder;
import com.wongs.domain.OrderShop;
import com.wongs.domain.Shipping;
import com.wongs.domain.Shop;
import com.wongs.domain.enumeration.CurrencyType;

/**
 * A DTO for the {@link com.wongs.domain.OrderShop} entity.
 */
public class OrderShopDTO implements Serializable {
    
    private Long id;

    private BigDecimal total;

    private CurrencyType currency;

    private String remark;

    private Shipping shipping;

    private Shop shop;

    private MyOrder order;
    
    private Set<OrderItemDTO> items = new HashSet<>();
    
    public OrderShopDTO() {
        // Empty constructor needed for Jackson.
	}
    
	public OrderShopDTO(OrderShop orderShop) {
		super();
		this.id = orderShop.getId();
		this.total = orderShop.getTotal();
		this.currency = orderShop.getCurrency();
		this.remark = orderShop.getRemark();
		
		this.shipping = orderShop.getShipping();
		this.shop = orderShop.getShop();
//		this.items = orderShop.getItems();
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

	public Shipping getShipping() {
		return shipping;
	}

	public void setShipping(Shipping shipping) {
		this.shipping = shipping;
	}

	public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}

	public MyOrder getOrder() {
		return order;
	}

	public void setOrder(MyOrder order) {
		this.order = order;
	}

	public Set<OrderItemDTO> getItems() {
		return items;
	}

	public void setItems(Set<OrderItemDTO> items) {
		this.items = items;
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
            "}";
    }
}
