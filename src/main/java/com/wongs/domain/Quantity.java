package com.wongs.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Quantity.
 */
@Entity
@Table(name = "quantity")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "quantity")
public class Quantity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jhi_from")
    private ZonedDateTime from;

    @Column(name = "jhi_to")
    private ZonedDateTime to;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    private ProductItem item;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFrom() {
        return from;
    }

    public Quantity from(ZonedDateTime from) {
        this.from = from;
        return this;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }

    public ZonedDateTime getTo() {
        return to;
    }

    public Quantity to(ZonedDateTime to) {
        this.to = to;
        return this;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Quantity quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ProductItem getItem() {
        return item;
    }

    public Quantity item(ProductItem productItem) {
        this.item = productItem;
        return this;
    }

    public void setItem(ProductItem productItem) {
        this.item = productItem;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Quantity quantity = (Quantity) o;
        if (quantity.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), quantity.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Quantity{" +
            "id=" + getId() +
            ", from='" + getFrom() + "'" +
            ", to='" + getTo() + "'" +
            ", quantity=" + getQuantity() +
            "}";
    }
}
