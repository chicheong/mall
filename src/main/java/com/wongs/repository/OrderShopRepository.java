package com.wongs.repository;

import com.wongs.domain.OrderShop;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the OrderShop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderShopRepository extends JpaRepository<OrderShop, Long> {
}
