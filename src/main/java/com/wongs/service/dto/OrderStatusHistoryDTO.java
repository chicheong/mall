package com.wongs.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.MyOrder;
import com.wongs.domain.OrderStatusHistory;
import com.wongs.domain.enumeration.OrderStatus;

/**
 * A DTO for the {@link com.wongs.domain.OrderStatusHistory} entity.
 */
public class OrderStatusHistoryDTO implements Serializable {
    
    private Long id;

    private ZonedDateTime effectiveDate;

    private OrderStatus status;

    private MyOrder order;

    public OrderStatusHistoryDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public OrderStatusHistoryDTO(OrderStatusHistory orderStatusHistory) {
        this.id = orderStatusHistory.getId();
    	this.effectiveDate = orderStatusHistory.getEffectiveDate();
    	this.status = orderStatusHistory.getStatus();
    	this.order = orderStatusHistory.getOrder();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(ZonedDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public MyOrder getOrder() {
		return order;
	}

	public void setOrder(MyOrder order) {
		this.order = order;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        OrderStatusHistoryDTO orderStatusHistoryDTO = (OrderStatusHistoryDTO) o;
        if (orderStatusHistoryDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), orderStatusHistoryDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OrderStatusHistoryDTO{" +
            "id=" + getId() +
            ", effectiveDate='" + getEffectiveDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
