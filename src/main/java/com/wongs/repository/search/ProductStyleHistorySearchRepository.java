package com.wongs.repository.search;

import com.wongs.domain.ProductStyleHistory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ProductStyleHistory entity.
 */
public interface ProductStyleHistorySearchRepository extends ElasticsearchRepository<ProductStyleHistory, Long> {
}
