package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class PaymentCardMapperTest {

    private PaymentCardMapper paymentCardMapper;

    @BeforeEach
    public void setUp() {
        paymentCardMapper = new PaymentCardMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(paymentCardMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(paymentCardMapper.fromId(null)).isNull();
    }
}
