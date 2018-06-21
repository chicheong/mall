package com.wongs.repository.search;

import com.wongs.domain.PaymentCreditCard;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PaymentCreditCard entity.
 */
public interface PaymentCreditCardSearchRepository extends ElasticsearchRepository<PaymentCreditCard, Long> {
}
