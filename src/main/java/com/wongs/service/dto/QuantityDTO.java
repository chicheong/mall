package com.wongs.service.dto;


import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.ProductItem;
import com.wongs.domain.Quantity;

/**
 * A DTO for the Quantity entity.
 */
public class QuantityDTO implements Serializable {

    private Long id;

    private ZonedDateTime from;

    private ZonedDateTime to;

    private Integer quantity;

    private ProductItem item;

    public QuantityDTO() {
        // Empty constructor needed for Jackson.
	}

	public QuantityDTO(Quantity quantity) {
		this.id = quantity.getId();
		this.from = quantity.getFrom();
		this.to = quantity.getTo();
		this.quantity = quantity.getQuantity();
		this.item = quantity.getItem();
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFrom() {
        return from;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }

    public ZonedDateTime getTo() {
        return to;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ProductItem getItem() {
		return item;
	}

	public void setItem(ProductItem item) {
		this.item = item;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        QuantityDTO quantityDTO = (QuantityDTO) o;
        if(quantityDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), quantityDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuantityDTO{" +
            "id=" + getId() +
            ", from='" + getFrom() + "'" +
            ", to='" + getTo() + "'" +
            ", quantity=" + getQuantity() +
            "}";
    }
}
