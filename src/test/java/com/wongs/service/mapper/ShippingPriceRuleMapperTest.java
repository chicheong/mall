package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ShippingPriceRuleMapperTest {

    private ShippingPriceRuleMapper shippingPriceRuleMapper;

    @BeforeEach
    public void setUp() {
        shippingPriceRuleMapper = new ShippingPriceRuleMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(shippingPriceRuleMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(shippingPriceRuleMapper.fromId(null)).isNull();
    }
}
