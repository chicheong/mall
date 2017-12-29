package com.wongs.repository;

import com.wongs.domain.ProductStyleHistory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ProductStyleHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductStyleHistoryRepository extends JpaRepository<ProductStyleHistory, Long> {

}
