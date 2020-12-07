package com.wongs.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.Shipping;
import com.wongs.domain.ShippingStatusHistory;
import com.wongs.domain.enumeration.ShippingStatus;

/**
 * A DTO for the {@link com.wongs.domain.ShippingStatusHistory} entity.
 */
public class ShippingStatusHistoryDTO implements Serializable {
    
    private Long id;

    private ZonedDateTime effectiveDate;

    private ShippingStatus status;

    private Shipping shipping;

    public ShippingStatusHistoryDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public ShippingStatusHistoryDTO(ShippingStatusHistory shippingStatusHistory) {
        this.id = shippingStatusHistory.getId();
    	this.effectiveDate = shippingStatusHistory.getEffectiveDate();
    	this.status = shippingStatusHistory.getStatus();
    	this.shipping = shippingStatusHistory.getShipping();
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

    public ShippingStatus getStatus() {
        return status;
    }

    public void setStatus(ShippingStatus status) {
        this.status = status;
    }

    public Shipping getShipping() {
		return shipping;
	}

	public void setShipping(Shipping shipping) {
		this.shipping = shipping;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ShippingStatusHistoryDTO shippingStatusHistoryDTO = (ShippingStatusHistoryDTO) o;
        if (shippingStatusHistoryDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shippingStatusHistoryDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShippingStatusHistoryDTO{" +
            "id=" + getId() +
            ", effectiveDate='" + getEffectiveDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", shipping=" + getShipping() +
            "}";
    }
}
