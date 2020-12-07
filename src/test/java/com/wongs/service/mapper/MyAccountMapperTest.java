package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class MyAccountMapperTest {

    private MyAccountMapper myAccountMapper;

    @BeforeEach
    public void setUp() {
        myAccountMapper = new MyAccountMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(myAccountMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(myAccountMapper.fromId(null)).isNull();
    }
}
