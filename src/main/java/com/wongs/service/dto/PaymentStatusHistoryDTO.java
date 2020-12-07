package com.wongs.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.Payment;
import com.wongs.domain.PaymentStatusHistory;
import com.wongs.domain.enumeration.PaymentStatus;

/**
 * A DTO for the {@link com.wongs.domain.PaymentStatusHistory} entity.
 */
public class PaymentStatusHistoryDTO implements Serializable {
    
    private Long id;

    private ZonedDateTime effectiveDate;

    private PaymentStatus status;

    private Payment payment;
    
    public PaymentStatusHistoryDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public PaymentStatusHistoryDTO(PaymentStatusHistory paymentStatusHistory) {
        this.id = paymentStatusHistory.getId();
    	this.effectiveDate = paymentStatusHistory.getEffectiveDate();
    	this.status = paymentStatusHistory.getStatus();
    	this.payment = paymentStatusHistory.getPayment();
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

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public Payment getPayment() {
		return payment;
	}

	public void setPayment(Payment payment) {
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

        PaymentStatusHistoryDTO paymentStatusHistoryDTO = (PaymentStatusHistoryDTO) o;
        if (paymentStatusHistoryDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentStatusHistoryDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentStatusHistoryDTO{" +
            "id=" + getId() +
            ", effectiveDate='" + getEffectiveDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", payment=" + getPayment() +
            "}";
    }
}
