package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class MyOrderDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyOrderDTO.class);
        MyOrderDTO myOrderDTO1 = new MyOrderDTO();
        myOrderDTO1.setId(1L);
        MyOrderDTO myOrderDTO2 = new MyOrderDTO();
        assertThat(myOrderDTO1).isNotEqualTo(myOrderDTO2);
        myOrderDTO2.setId(myOrderDTO1.getId());
        assertThat(myOrderDTO1).isEqualTo(myOrderDTO2);
        myOrderDTO2.setId(2L);
        assertThat(myOrderDTO1).isNotEqualTo(myOrderDTO2);
        myOrderDTO1.setId(null);
        assertThat(myOrderDTO1).isNotEqualTo(myOrderDTO2);
    }
}
