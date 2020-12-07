package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class PaymentStatusHistoryMapperTest {

    private PaymentStatusHistoryMapper paymentStatusHistoryMapper;

    @BeforeEach
    public void setUp() {
        paymentStatusHistoryMapper = new PaymentStatusHistoryMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(paymentStatusHistoryMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(paymentStatusHistoryMapper.fromId(null)).isNull();
    }
}
