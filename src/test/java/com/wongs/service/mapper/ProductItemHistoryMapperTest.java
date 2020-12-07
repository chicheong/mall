package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ProductItemHistoryMapperTest {

    private ProductItemHistoryMapper productItemHistoryMapper;

    @BeforeEach
    public void setUp() {
        productItemHistoryMapper = new ProductItemHistoryMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(productItemHistoryMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(productItemHistoryMapper.fromId(null)).isNull();
    }
}
