package com.wongs.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link ProductStyleSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ProductStyleSearchRepositoryMockConfiguration {

    @MockBean
    private ProductStyleSearchRepository mockProductStyleSearchRepository;

}
