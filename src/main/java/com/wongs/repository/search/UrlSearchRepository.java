package com.wongs.repository.search;

import com.wongs.domain.Url;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Url entity.
 */
public interface UrlSearchRepository extends ElasticsearchRepository<Url, Long> {
}
