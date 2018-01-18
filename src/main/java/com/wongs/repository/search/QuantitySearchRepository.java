package com.wongs.repository.search;

import com.wongs.domain.Quantity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Quantity entity.
 */
public interface QuantitySearchRepository extends ElasticsearchRepository<Quantity, Long> {
}
