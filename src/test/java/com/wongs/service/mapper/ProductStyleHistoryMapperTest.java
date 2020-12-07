package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ProductStyleHistoryMapperTest {

    private ProductStyleHistoryMapper productStyleHistoryMapper;

    @BeforeEach
    public void setUp() {
        productStyleHistoryMapper = new ProductStyleHistoryMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(productStyleHistoryMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(productStyleHistoryMapper.fromId(null)).isNull();
    }
}
