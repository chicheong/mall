package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ShippingPriceRuleDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShippingPriceRuleDTO.class);
        ShippingPriceRuleDTO shippingPriceRuleDTO1 = new ShippingPriceRuleDTO();
        shippingPriceRuleDTO1.setId(1L);
        ShippingPriceRuleDTO shippingPriceRuleDTO2 = new ShippingPriceRuleDTO();
        assertThat(shippingPriceRuleDTO1).isNotEqualTo(shippingPriceRuleDTO2);
        shippingPriceRuleDTO2.setId(shippingPriceRuleDTO1.getId());
        assertThat(shippingPriceRuleDTO1).isEqualTo(shippingPriceRuleDTO2);
        shippingPriceRuleDTO2.setId(2L);
        assertThat(shippingPriceRuleDTO1).isNotEqualTo(shippingPriceRuleDTO2);
        shippingPriceRuleDTO1.setId(null);
        assertThat(shippingPriceRuleDTO1).isNotEqualTo(shippingPriceRuleDTO2);
    }
}
