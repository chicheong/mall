package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class DelegationMapperTest {

    private DelegationMapper delegationMapper;

    @BeforeEach
    public void setUp() {
        delegationMapper = new DelegationMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(delegationMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(delegationMapper.fromId(null)).isNull();
    }
}
