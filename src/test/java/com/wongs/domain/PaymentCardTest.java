package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class PaymentCardTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentCard.class);
        PaymentCard paymentCard1 = new PaymentCard();
        paymentCard1.setId(1L);
        PaymentCard paymentCard2 = new PaymentCard();
        paymentCard2.setId(paymentCard1.getId());
        assertThat(paymentCard1).isEqualTo(paymentCard2);
        paymentCard2.setId(2L);
        assertThat(paymentCard1).isNotEqualTo(paymentCard2);
        paymentCard1.setId(null);
        assertThat(paymentCard1).isNotEqualTo(paymentCard2);
    }
}
