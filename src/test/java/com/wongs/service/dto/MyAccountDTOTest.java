package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class MyAccountDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyAccountDTO.class);
        MyAccountDTO myAccountDTO1 = new MyAccountDTO();
        myAccountDTO1.setId(1L);
        MyAccountDTO myAccountDTO2 = new MyAccountDTO();
        assertThat(myAccountDTO1).isNotEqualTo(myAccountDTO2);
        myAccountDTO2.setId(myAccountDTO1.getId());
        assertThat(myAccountDTO1).isEqualTo(myAccountDTO2);
        myAccountDTO2.setId(2L);
        assertThat(myAccountDTO1).isNotEqualTo(myAccountDTO2);
        myAccountDTO1.setId(null);
        assertThat(myAccountDTO1).isNotEqualTo(myAccountDTO2);
    }
}
