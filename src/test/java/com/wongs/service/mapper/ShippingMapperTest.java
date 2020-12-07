package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ShippingMapperTest {

    private ShippingMapper shippingMapper;

    @BeforeEach
    public void setUp() {
        shippingMapper = new ShippingMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(shippingMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(shippingMapper.fromId(null)).isNull();
    }
}
