package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ShippingStatusHistoryMapperTest {

    private ShippingStatusHistoryMapper shippingStatusHistoryMapper;

    @BeforeEach
    public void setUp() {
        shippingStatusHistoryMapper = new ShippingStatusHistoryMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(shippingStatusHistoryMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(shippingStatusHistoryMapper.fromId(null)).isNull();
    }
}
