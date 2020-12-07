package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductItemHistoryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItemHistory.class);
        ProductItemHistory productItemHistory1 = new ProductItemHistory();
        productItemHistory1.setId(1L);
        ProductItemHistory productItemHistory2 = new ProductItemHistory();
        productItemHistory2.setId(productItemHistory1.getId());
        assertThat(productItemHistory1).isEqualTo(productItemHistory2);
        productItemHistory2.setId(2L);
        assertThat(productItemHistory1).isNotEqualTo(productItemHistory2);
        productItemHistory1.setId(null);
        assertThat(productItemHistory1).isNotEqualTo(productItemHistory2);
    }
}
