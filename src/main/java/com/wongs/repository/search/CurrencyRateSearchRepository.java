package com.wongs.repository.search;

import com.wongs.domain.CurrencyRate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link CurrencyRate} entity.
 */
public interface CurrencyRateSearchRepository extends ElasticsearchRepository<CurrencyRate, Long> {
}
