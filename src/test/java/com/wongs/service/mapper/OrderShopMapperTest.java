package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class OrderShopMapperTest {

    private OrderShopMapper orderShopMapper;

    @BeforeEach
    public void setUp() {
        orderShopMapper = new OrderShopMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(orderShopMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(orderShopMapper.fromId(null)).isNull();
    }
}
