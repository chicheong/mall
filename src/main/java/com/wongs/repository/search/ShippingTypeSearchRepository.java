package com.wongs.repository.search;

import com.wongs.domain.ShippingType;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ShippingType} entity.
 */
public interface ShippingTypeSearchRepository extends ElasticsearchRepository<ShippingType, Long> {
}
