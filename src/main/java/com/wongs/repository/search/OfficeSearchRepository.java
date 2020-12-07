package com.wongs.repository.search;

import com.wongs.domain.Office;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Office} entity.
 */
public interface OfficeSearchRepository extends ElasticsearchRepository<Office, Long> {
}
