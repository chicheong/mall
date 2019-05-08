package com.wongs.repository.search;

import com.wongs.domain.ShippingPriceRule;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ShippingPriceRule entity.
 */
public interface ShippingPriceRuleSearchRepository extends ElasticsearchRepository<ShippingPriceRule, Long> {
}
