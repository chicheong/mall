package com.wongs.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link UserInfoSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class UserInfoSearchRepositoryMockConfiguration {

    @MockBean
    private UserInfoSearchRepository mockUserInfoSearchRepository;

}
