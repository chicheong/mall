package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ShippingPriceRuleTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingPriceRule.class);
        ShippingPriceRule shippingPriceRule1 = new ShippingPriceRule();
        shippingPriceRule1.setId(1L);
        ShippingPriceRule shippingPriceRule2 = new ShippingPriceRule();
        shippingPriceRule2.setId(shippingPriceRule1.getId());
        assertThat(shippingPriceRule1).isEqualTo(shippingPriceRule2);
        shippingPriceRule2.setId(2L);
        assertThat(shippingPriceRule1).isNotEqualTo(shippingPriceRule2);
        shippingPriceRule1.setId(null);
        assertThat(shippingPriceRule1).isNotEqualTo(shippingPriceRule2);
    }
}
