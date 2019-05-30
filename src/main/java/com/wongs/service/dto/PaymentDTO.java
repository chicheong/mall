package com.wongs.service.dto;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.wongs.domain.MyOrder;
import com.wongs.domain.Payment;
import com.wongs.domain.PaymentCard;
import com.wongs.domain.PaymentStatusHistory;
import com.wongs.domain.enumeration.CurrencyType;
import com.wongs.domain.enumeration.PaymentStatus;
import com.wongs.domain.enumeration.PaymentType;

/**
 * A DTO for the Payment entity.
 */
public class PaymentDTO implements Serializable {

    private Long id;

    private BigDecimal amount;

    private CurrencyType currency;

    private PaymentType type;

    private String remark;

    private PaymentStatus status;

    private MyOrder order;
    
    private String token;
    
    private PaymentCard paymentCard;
    
    private Set<PaymentStatusHistory> statusHistories = new HashSet<>();
    
    public PaymentDTO() {
        // Empty constructor needed for Jackson.
	}
    
    public PaymentDTO(Payment payment) {
		this.id = payment.getId();
		this.amount = payment.getAmount();
		this.currency = payment.getCurrency();
		this.type = payment.getType();
		this.remark = payment.getRemark();
		this.status = payment.getStatus();
		this.order = payment.getOrder();
		this.statusHistories = payment.getStatusHistories();
	}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public PaymentType getType() {
        return type;
    }

    public void setType(PaymentType type) {
        this.type = type;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public MyOrder getOrder() {
		return order;
	}

	public void setOrder(MyOrder order) {
		this.order = order;
	}

    public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public PaymentCard getPaymentCard() {
		return paymentCard;
	}

	public void setPaymentCard(PaymentCard paymentCard) {
		this.paymentCard = paymentCard;
	}

	public Set<PaymentStatusHistory> getStatusHistories() {
		return statusHistories;
	}

	public void setStatusHistories(Set<PaymentStatusHistory> statusHistories) {
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

        PaymentDTO paymentDTO = (PaymentDTO) o;
        if(paymentDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentDTO{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", currency='" + getCurrency() + "'" +
            ", type='" + getType() + "'" +
            ", remark='" + getRemark() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
