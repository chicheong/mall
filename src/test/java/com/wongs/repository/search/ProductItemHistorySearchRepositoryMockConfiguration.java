package com.wongs.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link ProductItemHistorySearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ProductItemHistorySearchRepositoryMockConfiguration {

    @MockBean
    private ProductItemHistorySearchRepository mockProductItemHistorySearchRepository;

}
