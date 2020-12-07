package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ProductStyleHistoryDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStyleHistoryDTO.class);
        ProductStyleHistoryDTO productStyleHistoryDTO1 = new ProductStyleHistoryDTO();
        productStyleHistoryDTO1.setId(1L);
        ProductStyleHistoryDTO productStyleHistoryDTO2 = new ProductStyleHistoryDTO();
        assertThat(productStyleHistoryDTO1).isNotEqualTo(productStyleHistoryDTO2);
        productStyleHistoryDTO2.setId(productStyleHistoryDTO1.getId());
        assertThat(productStyleHistoryDTO1).isEqualTo(productStyleHistoryDTO2);
        productStyleHistoryDTO2.setId(2L);
        assertThat(productStyleHistoryDTO1).isNotEqualTo(productStyleHistoryDTO2);
        productStyleHistoryDTO1.setId(null);
        assertThat(productStyleHistoryDTO1).isNotEqualTo(productStyleHistoryDTO2);
    }
}
