package com.wongs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wongs.domain.MyAccount;
import com.wongs.domain.MyOrder;
import com.wongs.domain.Shipping;


/**
 * Spring Data JPA repository for the Shipping entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Long> {

//	Shipping findByOrder(MyOrder myOrder);
}
