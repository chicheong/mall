package com.wongs.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import com.wongs.domain.enumeration.ShippingPriceRuleType;

/**
 * A ShippingPriceRule.
 */
@Entity
@Table(name = "shipping_price_rule")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "shippingpricerule")
public class ShippingPriceRule implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type")
    private ShippingPriceRuleType type;

    @Column(name = "jhi_value", precision = 10, scale = 2)
    private BigDecimal value;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "jhi_sequence")
    private Integer sequence;

    @ManyToOne
    @JsonIgnoreProperties("shippingPriceRules")
    private Shop shop;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ShippingPriceRuleType getType() {
        return type;
    }

    public ShippingPriceRule type(ShippingPriceRuleType type) {
        this.type = type;
        return this;
    }

    public void setType(ShippingPriceRuleType type) {
        this.type = type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public ShippingPriceRule value(BigDecimal value) {
        this.value = value;
        return this;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public ShippingPriceRule price(BigDecimal price) {
        this.price = price;
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getSequence() {
        return sequence;
    }

    public ShippingPriceRule sequence(Integer sequence) {
        this.sequence = sequence;
        return this;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

    public Shop getShop() {
        return shop;
    }

    public ShippingPriceRule shop(Shop shop) {
        this.shop = shop;
        return this;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
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
        ShippingPriceRule shippingPriceRule = (ShippingPriceRule) o;
        if (shippingPriceRule.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shippingPriceRule.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ShippingPriceRule{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", value=" + getValue() +
            ", price=" + getPrice() +
            ", sequence=" + getSequence() +
            "}";
    }
}
