package com.wongs.repository;

import com.wongs.domain.ProductItemHistory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ProductItemHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductItemHistoryRepository extends JpaRepository<ProductItemHistory, Long> {

}
