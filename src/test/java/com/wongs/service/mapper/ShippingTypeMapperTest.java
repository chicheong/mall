package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ShippingTypeMapperTest {

    private ShippingTypeMapper shippingTypeMapper;

    @BeforeEach
    public void setUp() {
        shippingTypeMapper = new ShippingTypeMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(shippingTypeMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(shippingTypeMapper.fromId(null)).isNull();
    }
}
