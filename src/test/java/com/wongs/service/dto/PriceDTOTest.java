package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class PriceDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PriceDTO.class);
        PriceDTO priceDTO1 = new PriceDTO();
        priceDTO1.setId(1L);
        PriceDTO priceDTO2 = new PriceDTO();
        assertThat(priceDTO1).isNotEqualTo(priceDTO2);
        priceDTO2.setId(priceDTO1.getId());
        assertThat(priceDTO1).isEqualTo(priceDTO2);
        priceDTO2.setId(2L);
        assertThat(priceDTO1).isNotEqualTo(priceDTO2);
        priceDTO1.setId(null);
        assertThat(priceDTO1).isNotEqualTo(priceDTO2);
    }
}
