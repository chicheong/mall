package com.wongs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.wongs.web.rest.TestUtil;

public class MyStateTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyState.class);
        MyState myState1 = new MyState();
        myState1.setId(1L);
        MyState myState2 = new MyState();
        myState2.setId(myState1.getId());
        assertThat(myState1).isEqualTo(myState2);
        myState2.setId(2L);
        assertThat(myState1).isNotEqualTo(myState2);
        myState1.setId(null);
        assertThat(myState1).isNotEqualTo(myState2);
    }
}
