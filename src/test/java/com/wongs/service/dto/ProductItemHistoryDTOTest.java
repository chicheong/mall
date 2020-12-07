package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductItemHistoryDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductItemHistoryDTO.class);
        ProductItemHistoryDTO productItemHistoryDTO1 = new ProductItemHistoryDTO();
        productItemHistoryDTO1.setId(1L);
        ProductItemHistoryDTO productItemHistoryDTO2 = new ProductItemHistoryDTO();
        assertThat(productItemHistoryDTO1).isNotEqualTo(productItemHistoryDTO2);
        productItemHistoryDTO2.setId(productItemHistoryDTO1.getId());
        assertThat(productItemHistoryDTO1).isEqualTo(productItemHistoryDTO2);
        productItemHistoryDTO2.setId(2L);
        assertThat(productItemHistoryDTO1).isNotEqualTo(productItemHistoryDTO2);
        productItemHistoryDTO1.setId(null);
        assertThat(productItemHistoryDTO1).isNotEqualTo(productItemHistoryDTO2);
    }
}
