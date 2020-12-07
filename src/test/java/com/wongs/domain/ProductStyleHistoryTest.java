package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductStyleHistoryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStyleHistory.class);
        ProductStyleHistory productStyleHistory1 = new ProductStyleHistory();
        productStyleHistory1.setId(1L);
        ProductStyleHistory productStyleHistory2 = new ProductStyleHistory();
        productStyleHistory2.setId(productStyleHistory1.getId());
        assertThat(productStyleHistory1).isEqualTo(productStyleHistory2);
        productStyleHistory2.setId(2L);
        assertThat(productStyleHistory1).isNotEqualTo(productStyleHistory2);
        productStyleHistory1.setId(null);
        assertThat(productStyleHistory1).isNotEqualTo(productStyleHistory2);
    }
}
