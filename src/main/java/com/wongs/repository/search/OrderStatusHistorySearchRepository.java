package com.wongs.repository.search;

import com.wongs.domain.OrderStatusHistory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link OrderStatusHistory} entity.
 */
public interface OrderStatusHistorySearchRepository extends ElasticsearchRepository<OrderStatusHistory, Long> {
}
