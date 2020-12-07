package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class PaymentStatusHistoryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentStatusHistory.class);
        PaymentStatusHistory paymentStatusHistory1 = new PaymentStatusHistory();
        paymentStatusHistory1.setId(1L);
        PaymentStatusHistory paymentStatusHistory2 = new PaymentStatusHistory();
        paymentStatusHistory2.setId(paymentStatusHistory1.getId());
        assertThat(paymentStatusHistory1).isEqualTo(paymentStatusHistory2);
        paymentStatusHistory2.setId(2L);
        assertThat(paymentStatusHistory1).isNotEqualTo(paymentStatusHistory2);
        paymentStatusHistory1.setId(null);
        assertThat(paymentStatusHistory1).isNotEqualTo(paymentStatusHistory2);
    }
}
