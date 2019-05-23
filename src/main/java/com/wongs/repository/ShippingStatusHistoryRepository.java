package com.wongs.repository;

import com.wongs.domain.ShippingStatusHistory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ShippingStatusHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShippingStatusHistoryRepository extends JpaRepository<ShippingStatusHistory, Long> {

}
