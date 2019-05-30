package com.wongs.repository;

import com.wongs.domain.MyOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import com.wongs.domain.MyAccount;
import com.wongs.domain.enumeration.OrderStatus;

import java.util.Set;

/**
 * Spring Data  repository for the MyOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyOrderRepository extends JpaRepository<MyOrder, Long> {

	Set<MyOrder> findByAccountAndStatus(MyAccount account, OrderStatus status);
}
