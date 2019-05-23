package com.wongs.repository;

import com.wongs.domain.MyOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MyOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyOrderRepository extends JpaRepository<MyOrder, Long> {

}
