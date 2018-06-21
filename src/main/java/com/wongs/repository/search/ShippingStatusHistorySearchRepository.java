package com.wongs.repository.search;

import com.wongs.domain.ShippingStatusHistory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ShippingStatusHistory entity.
 */
public interface ShippingStatusHistorySearchRepository extends ElasticsearchRepository<ShippingStatusHistory, Long> {
}
