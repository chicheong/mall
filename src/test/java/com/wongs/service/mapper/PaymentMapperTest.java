package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class PaymentMapperTest {

    private PaymentMapper paymentMapper;

    @BeforeEach
    public void setUp() {
        paymentMapper = new PaymentMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(paymentMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(paymentMapper.fromId(null)).isNull();
    }
}
