package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ShippingStatusHistoryDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingStatusHistoryDTO.class);
        ShippingStatusHistoryDTO shippingStatusHistoryDTO1 = new ShippingStatusHistoryDTO();
        shippingStatusHistoryDTO1.setId(1L);
        ShippingStatusHistoryDTO shippingStatusHistoryDTO2 = new ShippingStatusHistoryDTO();
        assertThat(shippingStatusHistoryDTO1).isNotEqualTo(shippingStatusHistoryDTO2);
        shippingStatusHistoryDTO2.setId(shippingStatusHistoryDTO1.getId());
        assertThat(shippingStatusHistoryDTO1).isEqualTo(shippingStatusHistoryDTO2);
        shippingStatusHistoryDTO2.setId(2L);
        assertThat(shippingStatusHistoryDTO1).isNotEqualTo(shippingStatusHistoryDTO2);
        shippingStatusHistoryDTO1.setId(null);
        assertThat(shippingStatusHistoryDTO1).isNotEqualTo(shippingStatusHistoryDTO2);
    }
}
