package com.wongs.repository;

import com.wongs.domain.OrderShop;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the OrderShop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderShopRepository extends JpaRepository<OrderShop, Long> {

}
