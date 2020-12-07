package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ShippingStatusHistoryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingStatusHistory.class);
        ShippingStatusHistory shippingStatusHistory1 = new ShippingStatusHistory();
        shippingStatusHistory1.setId(1L);
        ShippingStatusHistory shippingStatusHistory2 = new ShippingStatusHistory();
        shippingStatusHistory2.setId(shippingStatusHistory1.getId());
        assertThat(shippingStatusHistory1).isEqualTo(shippingStatusHistory2);
        shippingStatusHistory2.setId(2L);
        assertThat(shippingStatusHistory1).isNotEqualTo(shippingStatusHistory2);
        shippingStatusHistory1.setId(null);
        assertThat(shippingStatusHistory1).isNotEqualTo(shippingStatusHistory2);
    }
}
