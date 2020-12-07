package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class MyStateDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyStateDTO.class);
        MyStateDTO myStateDTO1 = new MyStateDTO();
        myStateDTO1.setId(1L);
        MyStateDTO myStateDTO2 = new MyStateDTO();
        assertThat(myStateDTO1).isNotEqualTo(myStateDTO2);
        myStateDTO2.setId(myStateDTO1.getId());
        assertThat(myStateDTO1).isEqualTo(myStateDTO2);
        myStateDTO2.setId(2L);
        assertThat(myStateDTO1).isNotEqualTo(myStateDTO2);
        myStateDTO1.setId(null);
        assertThat(myStateDTO1).isNotEqualTo(myStateDTO2);
    }
}
