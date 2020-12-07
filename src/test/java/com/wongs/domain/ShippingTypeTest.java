package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ShippingTypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingType.class);
        ShippingType shippingType1 = new ShippingType();
        shippingType1.setId(1L);
        ShippingType shippingType2 = new ShippingType();
        shippingType2.setId(shippingType1.getId());
        assertThat(shippingType1).isEqualTo(shippingType2);
        shippingType2.setId(2L);
        assertThat(shippingType1).isNotEqualTo(shippingType2);
        shippingType1.setId(null);
        assertThat(shippingType1).isNotEqualTo(shippingType2);
    }
}
