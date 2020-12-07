package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductHistoryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductHistory.class);
        ProductHistory productHistory1 = new ProductHistory();
        productHistory1.setId(1L);
        ProductHistory productHistory2 = new ProductHistory();
        productHistory2.setId(productHistory1.getId());
        assertThat(productHistory1).isEqualTo(productHistory2);
        productHistory2.setId(2L);
        assertThat(productHistory1).isNotEqualTo(productHistory2);
        productHistory1.setId(null);
        assertThat(productHistory1).isNotEqualTo(productHistory2);
    }
}
