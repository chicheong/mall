package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class OrderShopDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderShopDTO.class);
        OrderShopDTO orderShopDTO1 = new OrderShopDTO();
        orderShopDTO1.setId(1L);
        OrderShopDTO orderShopDTO2 = new OrderShopDTO();
        assertThat(orderShopDTO1).isNotEqualTo(orderShopDTO2);
        orderShopDTO2.setId(orderShopDTO1.getId());
        assertThat(orderShopDTO1).isEqualTo(orderShopDTO2);
        orderShopDTO2.setId(2L);
        assertThat(orderShopDTO1).isNotEqualTo(orderShopDTO2);
        orderShopDTO1.setId(null);
        assertThat(orderShopDTO1).isNotEqualTo(orderShopDTO2);
    }
}
