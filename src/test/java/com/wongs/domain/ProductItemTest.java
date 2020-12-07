package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductItemTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItem.class);
        ProductItem productItem1 = new ProductItem();
        productItem1.setId(1L);
        ProductItem productItem2 = new ProductItem();
        productItem2.setId(productItem1.getId());
        assertThat(productItem1).isEqualTo(productItem2);
        productItem2.setId(2L);
        assertThat(productItem1).isNotEqualTo(productItem2);
        productItem1.setId(null);
        assertThat(productItem1).isNotEqualTo(productItem2);
    }
}
