package com.wongs.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link PriceSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class PriceSearchRepositoryMockConfiguration {

    @MockBean
    private PriceSearchRepository mockPriceSearchRepository;

}
