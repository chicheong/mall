package com.wongs.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of OfficeSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class OfficeSearchRepositoryMockConfiguration {

    @MockBean
    private OfficeSearchRepository mockOfficeSearchRepository;

}
