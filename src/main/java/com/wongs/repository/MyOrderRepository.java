package com.wongs.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.wongs.domain.MyAccount;
import com.wongs.domain.MyOrder;
import com.wongs.domain.enumeration.OrderStatus;


/**
 * Spring Data JPA repository for the MyOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyOrderRepository extends JpaRepository<MyOrder, Long> {
	
	Set<MyOrder> findByAccountAndStatus(MyAccount account, OrderStatus status);
}
