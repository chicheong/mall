package com.wongs.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ContactMapperTest {

    private ContactMapper contactMapper;

    @BeforeEach
    public void setUp() {
        contactMapper = new ContactMapper();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(contactMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(contactMapper.fromId(null)).isNull();
    }
}
