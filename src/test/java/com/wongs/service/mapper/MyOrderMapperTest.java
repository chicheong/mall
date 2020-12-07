package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class MyOrderMapperTest {

    private MyOrderMapper myOrderMapper;

    @BeforeEach
    public void setUp() {
        myOrderMapper = new MyOrderMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(myOrderMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(myOrderMapper.fromId(null)).isNull();
    }
}
