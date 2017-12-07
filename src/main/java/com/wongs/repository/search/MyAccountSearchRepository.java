package com.wongs.repository.search;

import com.wongs.domain.MyAccount;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the MyAccount entity.
 */
public interface MyAccountSearchRepository extends ElasticsearchRepository<MyAccount, Long> {
}
