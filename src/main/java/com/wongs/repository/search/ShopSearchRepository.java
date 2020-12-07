package com.wongs.repository.search;

import com.wongs.domain.Shop;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Shop} entity.
 */
public interface ShopSearchRepository extends ElasticsearchRepository<Shop, Long> {
}
