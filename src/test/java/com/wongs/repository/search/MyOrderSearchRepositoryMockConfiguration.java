package com.wongs.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link MyOrderSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class MyOrderSearchRepositoryMockConfiguration {

    @MockBean
    private MyOrderSearchRepository mockMyOrderSearchRepository;

}
