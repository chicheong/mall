package com.wongs.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link ProductSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ProductSearchRepositoryMockConfiguration {

    @MockBean
    private ProductSearchRepository mockProductSearchRepository;

}
