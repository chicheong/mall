package com.wongs.repository.search;

import com.wongs.domain.PaymentStatusHistory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link PaymentStatusHistory} entity.
 */
public interface PaymentStatusHistorySearchRepository extends ElasticsearchRepository<PaymentStatusHistory, Long> {
}
