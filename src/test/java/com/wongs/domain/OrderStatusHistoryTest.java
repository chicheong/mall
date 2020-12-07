package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class OrderStatusHistoryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderStatusHistory.class);
        OrderStatusHistory orderStatusHistory1 = new OrderStatusHistory();
        orderStatusHistory1.setId(1L);
        OrderStatusHistory orderStatusHistory2 = new OrderStatusHistory();
        orderStatusHistory2.setId(orderStatusHistory1.getId());
        assertThat(orderStatusHistory1).isEqualTo(orderStatusHistory2);
        orderStatusHistory2.setId(2L);
        assertThat(orderStatusHistory1).isNotEqualTo(orderStatusHistory2);
        orderStatusHistory1.setId(null);
        assertThat(orderStatusHistory1).isNotEqualTo(orderStatusHistory2);
    }
}
