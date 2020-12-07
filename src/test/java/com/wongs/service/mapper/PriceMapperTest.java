package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class PriceMapperTest {

    private PriceMapper priceMapper;

    @BeforeEach
    public void setUp() {
        priceMapper = new PriceMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(priceMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(priceMapper.fromId(null)).isNull();
    }
}
