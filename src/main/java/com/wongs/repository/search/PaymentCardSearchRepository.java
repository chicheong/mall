package com.wongs.repository.search;

import com.wongs.domain.PaymentCard;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PaymentCard entity.
 */
public interface PaymentCardSearchRepository extends ElasticsearchRepository<PaymentCard, Long> {
}
