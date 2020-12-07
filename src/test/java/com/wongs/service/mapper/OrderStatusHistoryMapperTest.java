package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class OrderStatusHistoryMapperTest {

    private OrderStatusHistoryMapper orderStatusHistoryMapper;

    @BeforeEach
    public void setUp() {
        orderStatusHistoryMapper = new OrderStatusHistoryMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(orderStatusHistoryMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(orderStatusHistoryMapper.fromId(null)).isNull();
    }
}
