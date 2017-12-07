package com.wongs.repository.search;

import com.wongs.domain.Price;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Price entity.
 */
public interface PriceSearchRepository extends ElasticsearchRepository<Price, Long> {
}
