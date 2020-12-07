package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class MyStateMapperTest {

    private MyStateMapper myStateMapper;

    @BeforeEach
    public void setUp() {
        myStateMapper = new MyStateMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(myStateMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(myStateMapper.fromId(null)).isNull();
    }
}
