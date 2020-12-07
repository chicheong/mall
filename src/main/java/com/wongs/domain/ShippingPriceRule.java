package com.wongs.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.math.BigDecimal;

import com.wongs.domain.enumeration.ShippingPriceRuleType;

/**
 * A ShippingPriceRule.
 */
@Entity
@Table(name = "shipping_price_rule")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "shippingpricerule")
public class ShippingPriceRule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ShippingPriceRuleType type;

    @Column(name = "value", precision = 21, scale = 2)
    private BigDecimal value;

    @Column(name = "price", precision = 21, scale = 2)
    private BigDecimal price;

    @Column(name = "sequence")
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
        if (!(o instanceof ShippingPriceRule)) {
            return false;
        }
        return id != null && id.equals(((ShippingPriceRule) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
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
