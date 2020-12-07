package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class MyAccountTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyAccount.class);
        MyAccount myAccount1 = new MyAccount();
        myAccount1.setId(1L);
        MyAccount myAccount2 = new MyAccount();
        myAccount2.setId(myAccount1.getId());
        assertThat(myAccount1).isEqualTo(myAccount2);
        myAccount2.setId(2L);
        assertThat(myAccount1).isNotEqualTo(myAccount2);
        myAccount1.setId(null);
        assertThat(myAccount1).isNotEqualTo(myAccount2);
    }
}
