package com.wongs.repository.search;

import com.wongs.domain.MyState;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the MyState entity.
 */
public interface MyStateSearchRepository extends ElasticsearchRepository<MyState, Long> {
}
