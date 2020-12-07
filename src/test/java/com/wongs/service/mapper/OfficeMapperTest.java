package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class OfficeMapperTest {

    private OfficeMapper officeMapper;

    @BeforeEach
    public void setUp() {
        officeMapper = new OfficeMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(officeMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(officeMapper.fromId(null)).isNull();
    }
}
