package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class PaymentCardDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentCardDTO.class);
        PaymentCardDTO paymentCardDTO1 = new PaymentCardDTO();
        paymentCardDTO1.setId(1L);
        PaymentCardDTO paymentCardDTO2 = new PaymentCardDTO();
        assertThat(paymentCardDTO1).isNotEqualTo(paymentCardDTO2);
        paymentCardDTO2.setId(paymentCardDTO1.getId());
        assertThat(paymentCardDTO1).isEqualTo(paymentCardDTO2);
        paymentCardDTO2.setId(2L);
        assertThat(paymentCardDTO1).isNotEqualTo(paymentCardDTO2);
        paymentCardDTO1.setId(null);
        assertThat(paymentCardDTO1).isNotEqualTo(paymentCardDTO2);
    }
}
