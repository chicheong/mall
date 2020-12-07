package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ProductStyleMapperTest {

    private ProductStyleMapper productStyleMapper;

    @BeforeEach
    public void setUp() {
        productStyleMapper = new ProductStyleMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(productStyleMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(productStyleMapper.fromId(null)).isNull();
    }
}
