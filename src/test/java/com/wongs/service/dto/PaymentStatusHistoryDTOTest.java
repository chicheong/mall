package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class PaymentStatusHistoryDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentStatusHistoryDTO.class);
        PaymentStatusHistoryDTO paymentStatusHistoryDTO1 = new PaymentStatusHistoryDTO();
        paymentStatusHistoryDTO1.setId(1L);
        PaymentStatusHistoryDTO paymentStatusHistoryDTO2 = new PaymentStatusHistoryDTO();
        assertThat(paymentStatusHistoryDTO1).isNotEqualTo(paymentStatusHistoryDTO2);
        paymentStatusHistoryDTO2.setId(paymentStatusHistoryDTO1.getId());
        assertThat(paymentStatusHistoryDTO1).isEqualTo(paymentStatusHistoryDTO2);
        paymentStatusHistoryDTO2.setId(2L);
        assertThat(paymentStatusHistoryDTO1).isNotEqualTo(paymentStatusHistoryDTO2);
        paymentStatusHistoryDTO1.setId(null);
        assertThat(paymentStatusHistoryDTO1).isNotEqualTo(paymentStatusHistoryDTO2);
    }
}
