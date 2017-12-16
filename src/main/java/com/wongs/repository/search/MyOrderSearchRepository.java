package com.wongs.repository.search;

import com.wongs.domain.MyOrder;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the MyOrder entity.
 */
public interface MyOrderSearchRepository extends ElasticsearchRepository<MyOrder, Long> {
}
