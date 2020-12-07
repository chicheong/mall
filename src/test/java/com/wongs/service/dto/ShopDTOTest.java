package com.wongs.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class ShopDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShopDTO.class);
        ShopDTO shopDTO1 = new ShopDTO();
        shopDTO1.setId(1L);
        ShopDTO shopDTO2 = new ShopDTO();
        assertThat(shopDTO1).isNotEqualTo(shopDTO2);
        shopDTO2.setId(shopDTO1.getId());
        assertThat(shopDTO1).isEqualTo(shopDTO2);
        shopDTO2.setId(2L);
        assertThat(shopDTO1).isNotEqualTo(shopDTO2);
        shopDTO1.setId(null);
        assertThat(shopDTO1).isNotEqualTo(shopDTO2);
    }
}
