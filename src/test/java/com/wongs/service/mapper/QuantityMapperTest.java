package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class QuantityMapperTest {

    private QuantityMapper quantityMapper;

    @BeforeEach
    public void setUp() {
        quantityMapper = new QuantityMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(quantityMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(quantityMapper.fromId(null)).isNull();
    }
}
