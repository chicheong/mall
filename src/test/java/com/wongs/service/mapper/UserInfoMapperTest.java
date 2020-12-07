package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class UserInfoMapperTest {

    private UserInfoMapper userInfoMapper;

    @BeforeEach
    public void setUp() {
        userInfoMapper = new UserInfoMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(userInfoMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(userInfoMapper.fromId(null)).isNull();
    }
}
