package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class OrderShopTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderShop.class);
        OrderShop orderShop1 = new OrderShop();
        orderShop1.setId(1L);
        OrderShop orderShop2 = new OrderShop();
        orderShop2.setId(orderShop1.getId());
        assertThat(orderShop1).isEqualTo(orderShop2);
        orderShop2.setId(2L);
        assertThat(orderShop1).isNotEqualTo(orderShop2);
        orderShop1.setId(null);
        assertThat(orderShop1).isNotEqualTo(orderShop2);
    }
}
