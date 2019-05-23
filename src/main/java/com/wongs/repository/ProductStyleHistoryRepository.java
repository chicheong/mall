package com.wongs.repository;

import com.wongs.domain.ProductStyleHistory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ProductStyleHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductStyleHistoryRepository extends JpaRepository<ProductStyleHistory, Long> {

}
