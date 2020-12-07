package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ProductHistoryMapperTest {

    private ProductHistoryMapper productHistoryMapper;

    @BeforeEach
    public void setUp() {
        productHistoryMapper = new ProductHistoryMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(productHistoryMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(productHistoryMapper.fromId(null)).isNull();
    }
}
