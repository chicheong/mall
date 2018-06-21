package com.wongs.repository;

import com.wongs.domain.ShippingStatusHistory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ShippingStatusHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShippingStatusHistoryRepository extends JpaRepository<ShippingStatusHistory, Long> {

}
