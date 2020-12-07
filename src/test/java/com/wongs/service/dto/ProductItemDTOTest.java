package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductItemDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItemDTO.class);
        ProductItemDTO productItemDTO1 = new ProductItemDTO();
        productItemDTO1.setId(1L);
        ProductItemDTO productItemDTO2 = new ProductItemDTO();
        assertThat(productItemDTO1).isNotEqualTo(productItemDTO2);
        productItemDTO2.setId(productItemDTO1.getId());
        assertThat(productItemDTO1).isEqualTo(productItemDTO2);
        productItemDTO2.setId(2L);
        assertThat(productItemDTO1).isNotEqualTo(productItemDTO2);
        productItemDTO1.setId(null);
        assertThat(productItemDTO1).isNotEqualTo(productItemDTO2);
    }
}
