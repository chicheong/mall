package com.wongs.repository.search;

import com.wongs.domain.OrderShop;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the OrderShop entity.
 */
public interface OrderShopSearchRepository extends ElasticsearchRepository<OrderShop, Long> {
}
