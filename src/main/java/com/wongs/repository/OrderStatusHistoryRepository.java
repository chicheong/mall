package com.wongs.repository;

import com.wongs.domain.OrderStatusHistory;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the OrderStatusHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory,Long> {
    
}
