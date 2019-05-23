package com.wongs.repository;

import com.wongs.domain.ProductItemHistory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ProductItemHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductItemHistoryRepository extends JpaRepository<ProductItemHistory, Long> {

}
