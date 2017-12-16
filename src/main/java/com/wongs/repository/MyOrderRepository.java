package com.wongs.repository;

import com.wongs.domain.MyOrder;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the MyOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyOrderRepository extends JpaRepository<MyOrder, Long> {

}
