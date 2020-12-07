package com.wongs.repository.search;

import com.wongs.domain.ProductHistory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ProductHistory} entity.
 */
public interface ProductHistorySearchRepository extends ElasticsearchRepository<ProductHistory, Long> {
}
