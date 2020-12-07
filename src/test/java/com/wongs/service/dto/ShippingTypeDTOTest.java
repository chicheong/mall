package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ShippingTypeDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingTypeDTO.class);
        ShippingTypeDTO shippingTypeDTO1 = new ShippingTypeDTO();
        shippingTypeDTO1.setId(1L);
        ShippingTypeDTO shippingTypeDTO2 = new ShippingTypeDTO();
        assertThat(shippingTypeDTO1).isNotEqualTo(shippingTypeDTO2);
        shippingTypeDTO2.setId(shippingTypeDTO1.getId());
        assertThat(shippingTypeDTO1).isEqualTo(shippingTypeDTO2);
        shippingTypeDTO2.setId(2L);
        assertThat(shippingTypeDTO1).isNotEqualTo(shippingTypeDTO2);
        shippingTypeDTO1.setId(null);
        assertThat(shippingTypeDTO1).isNotEqualTo(shippingTypeDTO2);
    }
}
