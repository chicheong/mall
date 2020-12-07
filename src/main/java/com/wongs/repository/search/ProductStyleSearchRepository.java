package com.wongs.repository.search;

import com.wongs.domain.ProductStyle;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ProductStyle} entity.
 */
public interface ProductStyleSearchRepository extends ElasticsearchRepository<ProductStyle, Long> {
}
