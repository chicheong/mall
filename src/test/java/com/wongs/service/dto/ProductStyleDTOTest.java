package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductStyleDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStyleDTO.class);
        ProductStyleDTO productStyleDTO1 = new ProductStyleDTO();
        productStyleDTO1.setId(1L);
        ProductStyleDTO productStyleDTO2 = new ProductStyleDTO();
        assertThat(productStyleDTO1).isNotEqualTo(productStyleDTO2);
        productStyleDTO2.setId(productStyleDTO1.getId());
        assertThat(productStyleDTO1).isEqualTo(productStyleDTO2);
        productStyleDTO2.setId(2L);
        assertThat(productStyleDTO1).isNotEqualTo(productStyleDTO2);
        productStyleDTO1.setId(null);
        assertThat(productStyleDTO1).isNotEqualTo(productStyleDTO2);
    }
}
