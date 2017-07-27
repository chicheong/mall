package com.wongs.repository.search;

import com.wongs.domain.ProductItem;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ProductItem entity.
 */
public interface ProductItemSearchRepository extends ElasticsearchRepository<ProductItem, Long> {
}
