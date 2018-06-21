package com.wongs.repository.search;

import com.wongs.domain.CreditCard;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the CreditCard entity.
 */
public interface CreditCardSearchRepository extends ElasticsearchRepository<CreditCard, Long> {
}
