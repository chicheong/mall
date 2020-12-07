package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductStyleTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStyle.class);
        ProductStyle productStyle1 = new ProductStyle();
        productStyle1.setId(1L);
        ProductStyle productStyle2 = new ProductStyle();
        productStyle2.setId(productStyle1.getId());
        assertThat(productStyle1).isEqualTo(productStyle2);
        productStyle2.setId(2L);
        assertThat(productStyle1).isNotEqualTo(productStyle2);
        productStyle1.setId(null);
        assertThat(productStyle1).isNotEqualTo(productStyle2);
    }
}
