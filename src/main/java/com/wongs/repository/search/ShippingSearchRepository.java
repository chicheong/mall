package com.wongs.repository.search;

import com.wongs.domain.Shipping;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Shipping} entity.
 */
public interface ShippingSearchRepository extends ElasticsearchRepository<Shipping, Long> {
}
