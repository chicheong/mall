package com.wongs.repository.search;

import com.wongs.domain.ProductItemHistory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ProductItemHistory} entity.
 */
public interface ProductItemHistorySearchRepository extends ElasticsearchRepository<ProductItemHistory, Long> {
}
